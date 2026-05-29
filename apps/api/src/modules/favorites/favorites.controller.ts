import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { notImplemented } from "../../common/not-implemented";

@Controller()
export class FavoritesController {
  @Get("me/favorites")
  getMyFavorites() {
    return notImplemented("favorites.mine");
  }

  @Post("listings/:id/favorite")
  addFavorite(@Param("id") id: string) {
    return { ...notImplemented("favorites.add"), listingId: id };
  }

  @Delete("listings/:id/favorite")
  removeFavorite(@Param("id") id: string) {
    return { ...notImplemented("favorites.remove"), listingId: id };
  }
}
