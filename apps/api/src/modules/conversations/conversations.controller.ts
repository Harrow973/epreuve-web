import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { notImplemented } from "../../common/not-implemented";

@Controller()
export class ConversationsController {
  @Get("me/conversations")
  getMyConversations() {
    return notImplemented("conversations.mine");
  }

  @Get("conversations/:id")
  getConversation(@Param("id") id: string) {
    return { ...notImplemented("conversations.get"), id };
  }

  @Post("conversations")
  createConversation(@Body() body: unknown) {
    return { ...notImplemented("conversations.create"), body };
  }

  @Post("conversations/:id/messages")
  createMessage(@Param("id") id: string, @Body() body: unknown) {
    return { ...notImplemented("conversations.messages.create"), conversationId: id, body };
  }

  @Patch("conversations/:id/read")
  markConversationRead(@Param("id") id: string) {
    return { ...notImplemented("conversations.read"), id };
  }

  @Delete("messages/:id")
  deleteMessage(@Param("id") id: string) {
    return { ...notImplemented("messages.delete"), id };
  }
}
