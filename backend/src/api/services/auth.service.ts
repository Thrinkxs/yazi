import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import AppError from "../../utils/AppError";

export class AuthService {
  private cognitoClient: CognitoIdentityProviderClient;
  private clientId: string;

  constructor() {
    const clientConfig: any = {
      region: process.env.AWS_REGION!,
    };

    this.cognitoClient = new CognitoIdentityProviderClient(clientConfig);
    this.clientId = process.env.COGNITO_CLIENT_ID!;
  }

  /**
   * Login user with email and password
   */
  public async login(email: string, password: string) {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: email.toLowerCase(),
          PASSWORD: password,
        },
      });

      const response = await this.cognitoClient.send(command);

      if (!response.AuthenticationResult) {
        throw new AppError(401, "Authentication failed");
      }

      return {
        accessToken: response.AuthenticationResult.AccessToken,
        idToken: response.AuthenticationResult.IdToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
        expiresIn: response.AuthenticationResult.ExpiresIn,
      };
    } catch (error: any) {
      if (error.name === "NotAuthorizedException") {
        throw new AppError(401, "Invalid email or password");
      }
      if (error.name === "UserNotConfirmedException") {
        throw new AppError(403, "Please verify your email first");
      }
      throw new AppError(500, error.message || "Login failed");
    }
  }
}
