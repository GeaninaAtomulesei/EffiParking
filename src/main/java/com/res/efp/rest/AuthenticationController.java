package com.res.efp.rest;

import com.res.efp.domain.model.UserTokenState;
import com.res.efp.security.TokenHelper;
import com.res.efp.service.impl.CustomUserDetailsService;
import com.res.efp.utils.PasswordChanger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by gatomulesei on 2/1/2018.
 */
@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthenticationController {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private TokenHelper tokenHelper;

    @Value("${app.jwt.expires_in}")
    private int EXPIRES_IN;

    @Value("${app.jwt.cookie}")
    private String TOKEN_COOKIE;

    @Value("${app.jwt.header}")
    private String AUTH_HEADER;

    @RequestMapping(value = "/refresh", method = RequestMethod.GET)
    public ResponseEntity<?> refreshAuthToken(HttpServletRequest request, HttpServletResponse response) {
        String authToken = tokenHelper.getToken(request);
        if (authToken != null && tokenHelper.canTokenBeRefreshed(authToken)) {
            String refreshedToken = tokenHelper.refreshToken(authToken);
            Cookie authCookie = new Cookie(TOKEN_COOKIE, (refreshedToken));
            authCookie.setPath("/");
            authCookie.setHttpOnly(true);
            authCookie.setMaxAge(EXPIRES_IN);
            response.addCookie(authCookie);
            response.addHeader(AUTH_HEADER, "Bearer " + refreshedToken);
            UserTokenState userTokenState = new UserTokenState(refreshedToken, EXPIRES_IN);
            return ResponseEntity.ok(userTokenState);
        } else {
            UserTokenState userTokenState = new UserTokenState();
            return ResponseEntity.accepted().body(userTokenState);
        }
    }

    @RequestMapping(value = "/changePassword", method = RequestMethod.POST)
    public ResponseEntity<?> changePassword(@RequestBody PasswordChanger passwordChanger) {
        if(!passwordChanger.getNewPassword().equals(passwordChanger.getConfirmNewPassword())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("New passwords do not match!");
        }
        boolean validated = userDetailsService.validateOldPassword(passwordChanger.getOldPassword());
        if(validated) {
            boolean changed = userDetailsService.changePassword(passwordChanger.getNewPassword());
            if(changed) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "OK");
                return ResponseEntity.accepted().body(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Invalid old password!");
        }
    }

}
