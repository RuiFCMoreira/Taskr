package pt.mei.ea.taskr.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import pt.mei.ea.taskr.models.UserRole;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    public SecurityConfiguration(JwtAuthenticationFilter jwtAuthFilter, AuthenticationProvider authenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
//        http.csrf()
//            .disable()
//            .authorizeHttpRequests()
//            .shouldFilterAllDispatcherTypes(false)
//            .requestMatchers( "/api/users/clients/{id}", "/api/orders","/api/orders/*/review", "/api/municipalities/**")
//            .hasRole(UserRole.CLIENT.name())
//            .requestMatchers(HttpMethod.POST, "/api/users/providers/{id}/approve")
//            .hasRole(UserRole.ADMIN.name())
//            .requestMatchers(HttpMethod.POST, "/api/users/providers/{id}/*", "/api/orders/**")
//            .hasRole(UserRole.PROVIDER.name())
//            .requestMatchers( "/api/users/*", "/api/category/**")
//            .permitAll()
//            .anyRequest()
//            .authenticated()
//            .and()
//            .sessionManagement()
//            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//            .and()
//            .authenticationProvider(authenticationProvider)
//            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        http.csrf()
            .disable()
            .authorizeHttpRequests()
            .shouldFilterAllDispatcherTypes(false)
            .requestMatchers( "/**").permitAll();

        return http.build();
    }
}
