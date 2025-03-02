import { CredentialsSignin } from "next-auth";

export class IncorrectPasswordError extends CredentialsSignin {
  code = "incorrect-password";
  message = "Invalid credentials";
}

export class UserNotFoundError extends CredentialsSignin {
  code = "user-not-found";
  message = "Invalid credentials";
}
