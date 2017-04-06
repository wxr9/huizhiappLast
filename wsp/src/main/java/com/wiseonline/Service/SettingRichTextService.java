package com.wiseonline.Service;

import com.wiseonline.Domain.SettingRichText;

/**
 * Created by yanwj on 2015/11/26.
 */
public interface SettingRichTextService extends BaseDaoService<SettingRichText>{
    boolean enableRichText(int settingRichTextId, String flag);
}
