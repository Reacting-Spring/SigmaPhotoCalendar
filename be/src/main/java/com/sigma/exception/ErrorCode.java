package com.sigma.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    USER_NOT_FOUND("User not found", HttpStatus.NOT_FOUND),
    INVALID_PASSWORD("Invalid password", HttpStatus.BAD_REQUEST),
    DUPLICATED_ID("Duplicated user ID", HttpStatus.BAD_REQUEST),
    INVALID_REFRESH_TOKEN("Invalid refresh token", HttpStatus.BAD_REQUEST),
    FILE_UPLOAD_FAIL("File upload failed", HttpStatus.INTERNAL_SERVER_ERROR),
    FILE_NOT_FOUND("File not found", HttpStatus.NOT_FOUND),
    FILE_READ_FAIL("File read failed", HttpStatus.INTERNAL_SERVER_ERROR),
    FILE_DELETE_FAIL("File delete failed", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String message;
    private final HttpStatus status;

    ErrorCode(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }
}