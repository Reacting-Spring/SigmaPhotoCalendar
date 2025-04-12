package com.sigma.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class AuthRequest {

    @NotBlank
    private String userId;

    @NotBlank
    private String password;
}