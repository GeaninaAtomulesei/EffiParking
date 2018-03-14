package com.res.efp.security;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.util.Assert;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by gatomulesei on 2/1/2018.
 */
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private final Log LOGGER = LogFactory.getLog(this.getClass());

    @Autowired
    private TokenHelper tokenHelper;

    @Autowired
    private UserDetailsService userDetailsService;

    public static final String ROOT_MATCHER = "/";
    public static final String FAVICON_MATCHER = "/favicon.ico";
    public static final String HTML_MATCHER = "/**/*.html";
    public static final String CSS_MATCHER = "/**/*.css";
    public static final String JS_MATCHER = "/**/*.js";
    public static final String IMG_MATCHER = "/images/*";
    public static final String LOGIN_MATCHER = "/auth/login";
    public static final String LOGOUT_MATCHER = "/auth/logout";

    private List<String> pathsToSkip = Arrays.asList(
            ROOT_MATCHER,
            HTML_MATCHER,
            FAVICON_MATCHER,
            CSS_MATCHER,
            JS_MATCHER,
            IMG_MATCHER,
            LOGIN_MATCHER,
            LOGOUT_MATCHER
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authToken = tokenHelper.getToken(request);
        if(authToken != null && !skipPathRequest(request, pathsToSkip)) {
            try {
                String username = tokenHelper.getUsernameFromToken(authToken);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                TokenBasedAuthentication authentication = new TokenBasedAuthentication(userDetails);
                authentication.setToken(authToken);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch(Exception e) {
                SecurityContextHolder.getContext().setAuthentication(new AnonAuthentication());
            }
        } else {
            SecurityContextHolder.getContext().setAuthentication(new AnonAuthentication());
        }
        filterChain.doFilter(request, response);
    }

    private boolean skipPathRequest(HttpServletRequest request, List<String> pathsToSkip) {
        Assert.notNull(pathsToSkip, "Path cannot be null");
        List<RequestMatcher> matchers = pathsToSkip.stream().map(AntPathRequestMatcher::new).collect(Collectors.toList());
        OrRequestMatcher matcher = new OrRequestMatcher(matchers);
        return matcher.matches(request);
    }
}
