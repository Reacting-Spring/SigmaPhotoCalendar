package com.sigma.exception.handler;


import com.sigma.exception.CustomException;
import com.sigma.response.ExceptionResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<?> handleCustomException(CustomException ex) {
        return ResponseEntity
            .status(ex.getErrorCode().getStatus())
            .body(new ExceptionResponse(ex.getErrorCode().getMessage(),
                ex.getErrorCode().getStatus()));
    }

}
