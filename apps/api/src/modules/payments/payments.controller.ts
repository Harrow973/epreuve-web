import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PaymentsService } from "./payments.service";

type CreateCheckoutBody = {
  buyerId?: string;
};

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("checkout/listings/:listingId")
  createListingCheckout(
    @Param("listingId") listingId: string,
    @Body() body: CreateCheckoutBody,
  ) {
    return this.paymentsService.createMockListingCheckout({
      listingId,
      buyerId: body.buyerId,
    });
  }

  @Post("mock/checkout/:paymentId/succeed")
  succeedMockCheckout(@Param("paymentId") paymentId: string) {
    return this.paymentsService.succeedMockCheckout(paymentId);
  }

  @Get(":paymentId")
  getPayment(@Param("paymentId") paymentId: string) {
    return this.paymentsService.getPayment(paymentId);
  }
}
