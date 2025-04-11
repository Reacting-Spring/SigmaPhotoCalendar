package com.sigma.sigmacalendar.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user") // 데이터베이스 테이블명
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String userId;

    @Column(nullable = false)
    private String password;

    public User(String userId, String password){
        this.userId = userId;
        this.password = password;
    }
}
