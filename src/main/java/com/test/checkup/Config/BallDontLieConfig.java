package com.test.checkup.Config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class BallDontLieConfig {
    @Getter
    @Value("${balldontlie.api.base-url}")
    private String baseUrl;

    @Value("${balldontlie.api.key}")
    private String apiKey;

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getInterceptors().add((request, body, execution) -> {
            request.getHeaders().set("Authorization", apiKey);
            return execution.execute(request, body);
        });
        return restTemplate;
    }

}
