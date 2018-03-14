package com.res.efp.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.res.efp.domain.model.User;
import com.res.efp.domain.model.UserTokenState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by gatomulesei on 2/1/2018.
 */
@Component
public class AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${app.jwt.expires_in}")
    private int EXPIRES_IN;

    @Value("${app.jwt.cookie}")
    private String TOKEN_COOKIE;

    @Autowired
    private TokenHelper tokenHelper;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        clearAuthenticationAttributes(request);
        User user = (User) authentication.getPrincipal();
        String jws = tokenHelper.generateToken(user.getUsername());
        Cookie authCookie = new Cookie(TOKEN_COOKIE, (jws));
        authCookie.setHttpOnly(false);
        authCookie.setMaxAge(EXPIRES_IN);
        authCookie.setPath("/");
        response.addCookie(authCookie);
        UserTokenState userTokenState = new UserTokenState(jws, EXPIRES_IN);
        String jwtResponse = objectMapper.writeValueAsString(userTokenState);
        response.setContentType("application/json");
        response.getWriter().write(jwtResponse);
    }
}
