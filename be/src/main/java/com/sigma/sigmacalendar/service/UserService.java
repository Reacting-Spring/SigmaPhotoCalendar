package com.sigma.sigmacalendar.service;

import com.sigma.sigmacalendar.request.LoginPostReq;
import com.sigma.sigmacalendar.request.SignupPostReq;

public interface UserService {

    void signup(SignupPostReq request);
    void login(LoginPostReq request);

    
    
} 