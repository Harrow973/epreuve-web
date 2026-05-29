import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DatabaseService } from "../database/database.service";

type CreateMockListingCheckoutInput = {
  listingId: string;
  buyerId?: string;
};

@Injectable()
export class PaymentsService {
  constructor(private readonly database: DatabaseService) {}

  async createMockListingCheckout(input: CreateMockListingCheckoutInput) {
    if (!input.buyerId) {
      throw new BadRequestException("buyerId is required for the payment mock");
    }

    const buyerId = input.buyerId;

    const listing = await this.database.prisma.listing.findFirst({
      where: {
        id: input.listingId,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        userId: true,
        status: true,
        available: true,
        price: true,
        priceUnit: true,
      },
    });

    if (!listing) {
      throw new NotFoundException("Listing not found");
    }

    if (!listing.price) {
      throw new BadRequestException("Listing has no price");
    }

    const price = listing.price;

    if (!listing.available || listing.status !== "PUBLISHED") {
      throw new ConflictException("Listing is not available for checkout");
    }

    if (listing.userId === buyerId) {
      throw new BadRequestException("Owner cannot buy their own listing");
    }

    const buyer = await this.database.prisma.user.findUnique({
      where: { id: buyerId },
      select: { id: true },
    });

    if (!buyer) {
      throw new NotFoundException("Buyer not found");
    }

    const checkout = await this.database.prisma.$transaction(async (tx) => {
      const request = await tx.listingRequest.create({
        data: {
          listingId: listing.id,
          requesterId: buyerId,
          ownerId: listing.userId,
          requestType: "BUY",
          status: "PAYMENT_PENDING",
        },
      });

      const payment = await tx.payment.create({
        data: {
          requestId: request.id,
          payerId: buyerId,
          receiverId: listing.userId,
          amount: price,
          currency: listing.priceUnit ?? "EUR",
          provider: "STRIPE_MOCK",
          providerPaymentId: `mock_checkout_${request.id}`,
          status: "PENDING",
        },
      });

      return { request, payment };
    });

    return {
      mode: "mock",
      checkoutUrl: `/api/payments/mock/checkout/${checkout.payment.id}`,
      paymentId: checkout.payment.id,
      requestId: checkout.request.id,
      listing: {
        id: listing.id,
        title: listing.title,
        price: listing.price.toString(),
        currency: listing.priceUnit ?? "EUR",
      },
    };
  }

  async succeedMockCheckout(paymentId: string) {
    const payment = await this.database.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        request: {
          select: {
            id: true,
            listingId: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException("Payment not found");
    }

    if (payment.provider !== "STRIPE_MOCK") {
      throw new BadRequestException("Only mock payments can use this endpoint");
    }

    if (payment.status === "PAID") {
      return { status: "PAID", paymentId: payment.id };
    }

    if (!payment.request?.listingId) {
      throw new BadRequestException("Payment is not attached to a listing request");
    }

    const updated = await this.database.prisma.$transaction(async (tx) => {
      const paidPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });

      await tx.listingRequest.update({
        where: { id: payment.request!.id },
        data: { status: "PAID" },
      });

      await tx.listing.update({
        where: { id: payment.request!.listingId },
        data: {
          available: false,
          status: "SOLD",
        },
      });

      return paidPayment;
    });

    return {
      status: updated.status,
      paymentId: updated.id,
      paidAt: updated.paidAt,
    };
  }

  async getPayment(paymentId: string) {
    const payment = await this.database.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        request: {
          select: {
            id: true,
            listingId: true,
            status: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException("Payment not found");
    }

    return payment;
  }
}
