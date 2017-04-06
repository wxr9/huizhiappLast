package com.wiseonline.Service.Impl;

import com.wiseonline.Domain.EmailConfig;
import com.wiseonline.Domain.EnterApply;
import com.wiseonline.Service.EmailConfigService;
import com.wiseonline.Service.EnterApplyService;
import org.springframework.stereotype.Service;

/**
 * Created by R7tech on 3/22/2016.
 */
@Service("emailConfigService")
public class EmailConfigServiceImpl extends BaseDaoServiceImpl<EmailConfig> implements EmailConfigService {
}
