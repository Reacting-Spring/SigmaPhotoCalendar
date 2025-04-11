package com.sigma.sigmacalendar.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SignupPostReq {

    @NotNull
    private String userId;
    
    @NotNull
    private String password;

}