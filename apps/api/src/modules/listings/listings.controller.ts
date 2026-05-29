import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { notImplemented } from "../../common/not-implemented";

@Controller()
export class ListingsController {
  @Get("listings")
  listListings(@Query() query: Record<string, string>) {
    return { ...notImplemented("listings.list"), query };
  }

  @Get("listings/:id")
  getListing(@Param("id") id: string) {
    return { ...notImplemented("listings.get"), id };
  }

  @Post("listings")
  createListing(@Body() body: unknown) {
    return { ...notImplemented("listings.create"), body };
  }

  @Patch("listings/:id")
  updateListing(@Param("id") id: string, @Body() body: unknown) {
    return { ...notImplemented("listings.update"), id, body };
  }

  @Delete("listings/:id")
  deleteListing(@Param("id") id: string) {
    return { ...notImplemented("listings.delete"), id };
  }

  @Get("me/listings")
  getMyListings() {
    return notImplemented("listings.mine");
  }

  @Patch("listings/:id/publish")
  publishListing(@Param("id") id: string) {
    return { ...notImplemented("listings.publish"), id };
  }

  @Patch("listings/:id/archive")
  archiveListing(@Param("id") id: string) {
    return { ...notImplemented("listings.archive"), id };
  }

  @Patch("listings/:id/availability")
  updateListingAvailability(@Param("id") id: string, @Body() body: unknown) {
    return { ...notImplemented("listings.availability.update"), id, body };
  }

  @Post("listings/:id/images")
  addImage(@Param("id") id: string, @Body() body: unknown) {
    return { ...notImplemented("listings.images.create"), id, body };
  }

  @Patch("listings/:id/images/:imageId")
  updateImage(@Param("id") id: string, @Param("imageId") imageId: string, @Body() body: unknown) {
    return { ...notImplemented("listings.images.update"), id, imageId, body };
  }

  @Delete("listings/:id/images/:imageId")
  deleteImage(@Param("id") id: string, @Param("imageId") imageId: string) {
    return { ...notImplemented("listings.images.delete"), id, imageId };
  }

  @Patch("listings/:id/images/reorder")
  reorderImages(@Param("id") id: string, @Body() body: unknown) {
    return { ...notImplemented("listings.images.reorder"), id, body };
  }

  @Get("listings/:id/location")
  getLocation(@Param("id") id: string) {
    return { ...notImplemented("listings.location.get"), id };
  }

  @Put("listings/:id/location")
  upsertLocation(@Param("id") id: string, @Body() body: unknown) {
    return { ...notImplemented("listings.location.upsert"), id, body };
  }

  @Patch("listings/:id/location/visibility")
  updateLocationVisibility(@Param("id") id: string, @Body() body: unknown) {
    return { ...notImplemented("listings.location.visibility"), id, body };
  }

  @Get("listings/:id/availabilities")
  getAvailabilities(@Param("id") id: string) {
    return { ...notImplemented("listings.availabilities.list"), id };
  }

  @Post("listings/:id/availabilities")
  createAvailability(@Param("id") id: string, @Body() body: unknown) {
    return { ...notImplemented("listings.availabilities.create"), id, body };
  }

  @Patch("listings/:id/availabilities/:availabilityId")
  updateAvailability(
    @Param("id") id: string,
    @Param("availabilityId") availabilityId: string,
    @Body() body: unknown,
  ) {
    return { ...notImplemented("listings.availabilities.update"), id, availabilityId, body };
  }

  @Delete("listings/:id/availabilities/:availabilityId")
  deleteAvailability(@Param("id") id: string, @Param("availabilityId") availabilityId: string) {
    return { ...notImplemented("listings.availabilities.delete"), id, availabilityId };
  }
}
