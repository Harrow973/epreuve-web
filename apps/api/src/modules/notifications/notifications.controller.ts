import { Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { notImplemented } from "../../common/not-implemented";

@Controller()
export class NotificationsController {
  @Get("me/notifications")
  getMyNotifications() {
    return notImplemented("notifications.mine");
  }

  @Patch("me/notifications/:id/read")
  markNotificationRead(@Param("id") id: string) {
    return { ...notImplemented("notifications.read"), id };
  }

  @Patch("me/notifications/read-all")
  markAllNotificationsRead() {
    return notImplemented("notifications.readAll");
  }

  @Delete("me/notifications/:id")
  deleteNotification(@Param("id") id: string) {
    return { ...notImplemented("notifications.delete"), id };
  }
}
