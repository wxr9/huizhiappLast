package com.wiseonline.Service.Impl;

import com.wiseonline.Domain.LoginLog;
import com.wiseonline.Domain.PayLog;
import com.wiseonline.Service.LoginLogService;
import com.wiseonline.Service.PayLogService;
import org.springframework.stereotype.Service;

/**
 * Created by R7tech on 2/25/2016.
 */
@Service("payLogService")
public class PayLogServiceImpl extends BaseDaoServiceImpl<PayLog> implements PayLogService {
}
