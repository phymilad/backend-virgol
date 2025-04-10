export enum BadRequestMessage {
    InvalidLoginData="Data is not correct for login",
    InvalidRegisterData="Data is not correct for register",
    InvalidEmailFormat="Email format is incorrect",
    InvalidMobileFormat="Mobile phone is incorrect",
    InvalidUsernameFormat="Username is not valid",
}

export enum AuthMessage {
    NotFoundAccount="Account is not found",
    AlreadyExistAccount="Account with this name already exists!",
    ExpiredCode="Your code is expired",
    TryAgain="Please Try again",
    LoginAgain="Please try to login again",
    LoginIsRequired="Login to your account"
}

export enum NotFoundMessage {
    NotFound="Item not found",
    NotFoundCategory="Category not found",
    NotFoundPost="Post not found",
    NotFoundUser="User not found",
}

export enum ValidationMessage {

}

export enum PublicMessage {
    LoginSuccessfully="You logged in successfully",
    OtpSentSuccessfully="Otp code is sent successfully",
    Created="Created successfully",
    Deleted="Deleted successfully",
    Updated="Updated successfully",
    Inserted="Inserted successfully",
}

export enum ConflictMessage {
    CategoryTitle="title already exists",
}