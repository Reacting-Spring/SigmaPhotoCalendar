package com.sigma;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy
public class SigmaApplication {

	public static void main(String[] args) {
		SpringApplication.run(SigmaApplication.class, args);
	}

}
