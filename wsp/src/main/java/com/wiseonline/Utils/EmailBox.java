package com.wiseonline.Utils;

import com.wiseonline.Service.IMailSenderProvider;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import javax.mail.internet.MimeMessage;
import java.util.Date;
import java.util.Map;

/**
 * Created by R7tech on 4/18/2016.
 */
public class EmailBox {
    @Autowired
    private IMailSenderProvider mailSenderProvider;
    /**
     * 执行发送邮件
     *
     * @param emailAddr
     *            被邀请会员接收邮件地址
     */
    public void sendEmail(final String emailAddr, final String title, final String content) {
        try {
                new Thread(new Runnable() {
                    public void run() {
                        try {
                            JavaMailSenderImpl sender = mailSenderProvider
                                    .getSender();
                            MimeMessage mimeMessage = sender
                                    .createMimeMessage();
                            mimeMessage.setSentDate(new Date());
                            MimeMessageHelper helper = new MimeMessageHelper(
                                    mimeMessage, false, "utf-8");
                            helper.setFrom(sender.getUsername());
                            //helper.setFrom(sender.getUsername(), titlePrefix);
                            helper.setSubject(title);
                            helper.setText(content, true);
                            helper.setTo(emailAddr);
                            sender.send(mimeMessage);
                            System.out.print("邮件发送中: %s\n" + emailAddr);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }).start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
