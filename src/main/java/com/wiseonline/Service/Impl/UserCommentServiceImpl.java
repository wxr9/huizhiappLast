package com.wiseonline.Service.Impl;


import com.wiseonline.Domain.UserComment;
import com.wiseonline.Service.UserCommentService;
import org.springframework.stereotype.Service;

/**
 * Created by wanx on 2015/11/11.
 */
@Service("userCommentService")
public class UserCommentServiceImpl extends BaseDaoServiceImpl<UserComment> implements UserCommentService {
}
