import { Body, Controller, Get, Post } from "@nestjs/common";
import { notImplemented } from "../../common/not-implemented";

@Controller("auth")
export class AuthController {
  @Post("register")
  register(@Body() body: unknown) {
    return { ...notImplemented("auth.register"), body };
  }

  @Post("login")
  login(@Body() body: unknown) {
    return { ...notImplemented("auth.login"), body };
  }

  @Post("logout")
  logout() {
    return notImplemented("auth.logout");
  }

  @Post("refresh")
  refresh() {
    return notImplemented("auth.refresh");
  }

  @Post("verify-email")
  verifyEmail(@Body() body: unknown) {
    return { ...notImplemented("auth.verifyEmail"), body };
  }

  @Post("resend-verification")
  resendVerification(@Body() body: unknown) {
    return { ...notImplemented("auth.resendVerification"), body };
  }

  @Post("forgot-password")
  forgotPassword(@Body() body: unknown) {
    return { ...notImplemented("auth.forgotPassword"), body };
  }

  @Post("reset-password")
  resetPassword(@Body() body: unknown) {
    return { ...notImplemented("auth.resetPassword"), body };
  }

  @Get("me")
  me() {
    return notImplemented("auth.me");
  }
}
