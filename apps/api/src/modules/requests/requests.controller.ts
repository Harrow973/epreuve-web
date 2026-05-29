import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { notImplemented } from "../../common/not-implemented";

@Controller()
export class RequestsController {
  @Post("listings/:id/requests")
  createRequest(@Param("id") id: string, @Body() body: unknown) {
    return { ...notImplemented("requests.create"), listingId: id, body };
  }

  @Get("me/requests")
  getMyRequests() {
    return notImplemented("requests.mine");
  }

  @Get("me/requests/received")
  getReceivedRequests() {
    return notImplemented("requests.received");
  }

  @Get("requests/:id")
  getRequest(@Param("id") id: string) {
    return { ...notImplemented("requests.get"), id };
  }

  @Patch("requests/:id/accept")
  acceptRequest(@Param("id") id: string) {
    return { ...notImplemented("requests.accept"), id };
  }

  @Patch("requests/:id/reject")
  rejectRequest(@Param("id") id: string) {
    return { ...notImplemented("requests.reject"), id };
  }

  @Patch("requests/:id/cancel")
  cancelRequest(@Param("id") id: string) {
    return { ...notImplemented("requests.cancel"), id };
  }

  @Patch("requests/:id/complete")
  completeRequest(@Param("id") id: string) {
    return { ...notImplemented("requests.complete"), id };
  }
}
