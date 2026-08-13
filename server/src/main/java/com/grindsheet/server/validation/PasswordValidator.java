package com.grindsheet.server.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<ValidPassword, String> {

    private static final int MIN_LENGTH = 8;
    private static final String UPPERCASE = ".*[A-Z].*";
    private static final String LOWERCASE = ".*[a-z].*";
    private static final String NUMBER = ".*[0-9].*";
    private static final String SPECIAL_CHAR = ".*[^a-zA-Z0-9].*";
    private static final String NO_SPACES = "^\\S+$";

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {

        if (password == null) {
            buildMessage(context, "Password cannot be null");
            return false;
        }

        if (password.length() < MIN_LENGTH) {
            buildMessage(context, "Password must be at least 8 characters long");
            return false;
        }

        if (!password.matches(UPPERCASE)) {
            buildMessage(context, "Password must contain at least one uppercase letter");
            return false;
        }

        if (!password.matches(LOWERCASE)) {
            buildMessage(context, "Password must contain at least one lowercase letter");
            return false;
        }

        if (!password.matches(NUMBER)) {
            buildMessage(context, "Password must contain at least one number");
            return false;
        }

        if (!password.matches(SPECIAL_CHAR)) {
            buildMessage(context, "Password must contain at least one special character");
            return false;
        }

        if (!password.matches(NO_SPACES)) {
            buildMessage(context, "Password must not contain spaces");
            return false;
        }

        return true;
    }

    private void buildMessage(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message)
                .addConstraintViolation();
    }
}