package com.wiseonline.Service.Impl;

import com.wiseonline.Domain.SettingRichText;
import com.wiseonline.Service.SettingRichTextService;
import org.springframework.stereotype.Service;

/**
 * Created by yanwj on 2015/11/26.
 */
@Service("settingRichTextService")
public class SettingRichTextServiceImpl extends BaseDaoServiceImpl<SettingRichText> implements SettingRichTextService{

    public boolean enableRichText(int settingRichTextId, String flag){
        SettingRichText settingRichText = this.getbyId(settingRichTextId);
        if (settingRichText != null){
            settingRichText.setDeleteFlag(Integer.valueOf(flag));
            boolean rst = this.update(settingRichText);
            if (rst){
                return true;
            }else {
                return false;
            }
        }else {
            return false;
        }
    }

}
