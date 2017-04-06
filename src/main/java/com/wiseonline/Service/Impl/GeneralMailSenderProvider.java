package com.wiseonline.Service.Impl;

import java.util.Properties;

import com.wiseonline.Domain.EmailConfig;
import com.wiseonline.Service.EmailConfigService;
import com.wiseonline.Service.IMailSenderProvider;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;


/**
 * 
 * 邮箱发送提供类
 * 
 * 该类在126,163,gmail,yahoo账户测试下通过
 * 
 * @author taiqichao
 * 
 */
@Service("generalMailSenderProvider")
public class GeneralMailSenderProvider implements IMailSenderProvider {
	@Autowired
	EmailConfigService emailConfigService;

	Log log = LogFactory.getLog(GeneralMailSenderProvider.class);

	private JavaMailSenderImpl sender;

	public GeneralMailSenderProvider() {
		sender = new JavaMailSenderImpl();
	}

//	@Value("${mail.hostName}")
//	private String hostName;
//	@Value("${mail.account}")
//	private String account;
//	@Value("${mail.password}")
//	private String password;
	
	public JavaMailSenderImpl getSender() {
		EmailConfig ec = emailConfigService.getbyId(1);
		String port = "25";
		sender.setHost(ec.getHostName());
		sender.setUsername(ec.getAccount());
		sender.setPassword(ec.getPassword());
		sender.setDefaultEncoding("UTF-8");

		Properties javaMailProperties = new Properties();
		javaMailProperties.put("mail.debug", "true");
		javaMailProperties.put("mail.smtp.auth", "true");
		javaMailProperties.put("mail.smtp.port", port);

		// Gmail SSL设置
		if (ec.getHostName().indexOf("smtp.gmail.com") >= 0) {
			log.info("gmail邮箱服务,SSL设置");
			javaMailProperties.put("mail.smtp.socketFactory.port", "465");
			javaMailProperties.put("mail.smtp.socketFactory.class",
					"javax.net.ssl.SSLSocketFactory");
			javaMailProperties.put("mail.smtp.socketFactory.fallbacks", "true");
		}
		sender.setJavaMailProperties(javaMailProperties);

		return this.sender;
	}

}
