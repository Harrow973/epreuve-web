import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { notImplemented } from "../../common/not-implemented";

@Controller()
export class UsersController {
  @Get("users/me")
  getMe() {
    return notImplemented("users.me.get");
  }

  @Patch("users/me")
  updateMe(@Body() body: unknown) {
    return { ...notImplemented("users.me.update"), body };
  }

  @Delete("users/me")
  deleteMe() {
    return notImplemented("users.me.delete");
  }

  @Get("users/:id")
  getUser(@Param("id") id: string) {
    return { ...notImplemented("users.get"), id };
  }

  @Get("users/:id/listings")
  getUserListings(@Param("id") id: string) {
    return { ...notImplemented("users.listings"), id };
  }

  @Get("users/:id/reviews")
  getUserReviews(@Param("id") id: string) {
    return { ...notImplemented("users.reviews"), id };
  }

  @Get("users/me/addresses")
  getMyAddresses() {
    return notImplemented("users.addresses.list");
  }

  @Post("users/me/addresses")
  createMyAddress(@Body() body: unknown) {
    return { ...notImplemented("users.addresses.create"), body };
  }

  @Patch("users/me/addresses/:addressId")
  updateMyAddress(@Param("addressId") addressId: string, @Body() body: unknown) {
    return { ...notImplemented("users.addresses.update"), addressId, body };
  }

  @Delete("users/me/addresses/:addressId")
  deleteMyAddress(@Param("addressId") addressId: string) {
    return { ...notImplemented("users.addresses.delete"), addressId };
  }

  @Patch("users/me/addresses/:addressId/default")
  setDefaultAddress(@Param("addressId") addressId: string) {
    return { ...notImplemented("users.addresses.default"), addressId };
  }

  @Post("users/:id/block")
  blockUser(@Param("id") id: string) {
    return { ...notImplemented("users.block"), id };
  }

  @Delete("users/:id/block")
  unblockUser(@Param("id") id: string) {
    return { ...notImplemented("users.unblock"), id };
  }

  @Get("me/blocked-users")
  getBlockedUsers() {
    return notImplemented("users.blockedUsers");
  }
}
