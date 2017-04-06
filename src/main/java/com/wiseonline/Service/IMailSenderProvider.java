package com.wiseonline.Service;

import org.springframework.mail.javamail.JavaMailSenderImpl;

public interface IMailSenderProvider {
	
	public JavaMailSenderImpl getSender();
}
