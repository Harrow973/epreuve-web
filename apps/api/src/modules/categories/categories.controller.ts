import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { notImplemented } from "../../common/not-implemented";

@Controller()
export class CategoriesController {
  @Get("categories")
  listCategories() {
    return notImplemented("categories.list");
  }

  @Get("categories/:id")
  getCategory(@Param("id") id: string) {
    return { ...notImplemented("categories.get"), id };
  }

  @Post("admin/categories")
  createCategory(@Body() body: unknown) {
    return { ...notImplemented("admin.categories.create"), body };
  }

  @Patch("admin/categories/:id")
  updateCategory(@Param("id") id: string, @Body() body: unknown) {
    return { ...notImplemented("admin.categories.update"), id, body };
  }

  @Delete("admin/categories/:id")
  deleteCategory(@Param("id") id: string) {
    return { ...notImplemented("admin.categories.delete"), id };
  }
}
