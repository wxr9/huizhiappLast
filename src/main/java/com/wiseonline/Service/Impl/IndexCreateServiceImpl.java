package com.wiseonline.Service.Impl;

import com.wiseonline.Domain.ActivityMain;
import com.wiseonline.Domain.HomepageAdver;
import com.wiseonline.Domain.Merchant;
import com.wiseonline.Service.ActivityMainService;
import com.wiseonline.Service.HomepageAdverService;
import com.wiseonline.Service.IndexCreateService;
import com.wiseonline.Service.MerchantService;
import com.wiseonline.Utils.PageResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.List;

/**
 * Created by kelsey on 2016-9-18.
 */
@Service("indexCreateService")
public class IndexCreateServiceImpl  implements IndexCreateService {

    @Value("#{configProperties['Index.all']}")
    private String index_all;

    @Value("#{configProperties['Index.Banner.status']}")
    private String banner_status;

    @Value("#{configProperties['Index.Banner.img']}")
    private String banner_img;

    @Value("#{configProperties['Index.Activity.img-1']}")
    private String activity_img1;

    @Value("#{configProperties['Index.Activity.images']}")
    private String activity_images;

    @Value("#{configProperties['Index.Life.edge']}")
    private String life_edge;

    @Value("#{configProperties['Index.Life.center']}")
    private String life_center;

    @Value("#{configProperties['Index.Life.taste']}")
    private String life_taste;
    @Autowired
    MerchantService merchantService;

    @Autowired
    HomepageAdverService homepageAdverService;

    @Autowired
    ActivityMainService activityMainService;

    /**
     * 根据业务生成html
     * @param filePath
     * @return
     */
    public Boolean createHtml(String filePath){
        String index = index_all;
        int len = 0;

        /*
        广告栏
         */
        HomepageAdver hpa = new HomepageAdver();
        hpa.isBan = 2;
        PageResult<HomepageAdver> hpa_list = homepageAdverService.findAll(1, 5, hpa,false,"orderA");
        StringBuilder banner_status_html = new StringBuilder();
        StringBuilder banner_img_html = new StringBuilder();
        if (hpa_list.getTotal() > 0) {
            banner_img_html.append(banner_img.replace("{active}", "active").replace("{imgPath}", hpa_list.getResult().get(0).getImgUrl() == null ? "":hpa_list.getResult().get(0).getImgUrl()));
            for (int i = 1; i < (hpa_list.getTotal()>5?5: hpa_list.getTotal()); i++) {
                banner_status_html.append(banner_status.replace("{i}", Integer.toString(i)));
                banner_img_html.append(banner_img.replace("{active}","").replace("{imgPath}", hpa_list.getResult().get(i).getImgUrl() == null ? "":hpa_list.getResult().get(i).getImgUrl() ));
            }
        }
        else{
            banner_img_html.append("<img src=\"/web/images/sb.png\" width=\"1200\">");
        }

        /*
        活动中心
         */
        ActivityMain activityMain = new ActivityMain();
        activityMain.isBan = 1;
        PageResult<ActivityMain> am_list = activityMainService.findAll(1, 6, activityMain,true,"createTime");
        StringBuilder acitvity_img_1 = new StringBuilder();
        StringBuilder acitvity_imgs = new StringBuilder();
        if (am_list.getTotal() > 0) {
            acitvity_img_1.append(activity_img1.replace("{url}", am_list.getResult().get(0).getDetails())
                    .replace("{needLogin}",String.valueOf(am_list.getResult().get(0).getNeedLogin()))
                    .replace("{imgPath}",am_list.getResult().get(0).getImage() == null ? "":am_list.getResult().get(0).getImage()));
            len = am_list.getResult().size();
            for (int i = 1; i < len; i++) {
                acitvity_imgs.append(activity_images.replace("{url}", am_list.getResult().get(i).getDetails())
                        .replace("{imgPath}",am_list.getResult().get(i).getImage())
                        .replace("{needLogin}",String.valueOf(am_list.getResult().get(i).getNeedLogin()))
                        .replace("{title}",am_list.getResult().get(i).getTitle()));
            }
        }

        /*
        生活中心
         */
        Merchant merchant = new Merchant();
        merchant.isCheck = 2;
        PageResult<Merchant> m_list = merchantService.findAll(1, 5, merchant,true,"hitCount");
        StringBuilder life_left = new StringBuilder();
        StringBuilder life_centers = new StringBuilder();
        StringBuilder life_right = new StringBuilder();
        if (m_list.getTotal() > 0) {
            len = m_list.getResult().size();
            for (int i = 0; i < len; i++) {
                if (i<2) { //左边
                    life_left.append(life_edge.replace("{id}", Integer.toString(m_list.getResult().get(i).getObjectid())).replace("{imgPath}", m_list.getResult().get(i).getAvar() == null ?"":m_list.getResult().get(i).getAvar()));
                }
                else if (i>2){ //右边
                    life_right.append(life_edge.replace("{id}", Integer.toString(m_list.getResult().get(i).getObjectid())).replace("{imgPath}", m_list.getResult().get(i).getAvar()== null ?"":m_list.getResult().get(i).getAvar()));
                }
                else{//中间
                    Merchant model = m_list.getResult().get(i);
                    String sql = "select FORMAT(ifnull(avg(t.env),0),1) as env,FORMAT(ifnull(avg(t.service),0),1) as service,FORMAT(ifnull(avg(t.taste),0),1) as taste from (select env,service,taste from merchant_evaluate where merchant="+model.getObjectid()+") t;";
                    List<Object[]> obj = merchantService.findByCustomerSQL(sql);
                    life_center = life_center.replace("{id}", Integer.toString(model.getObjectid()))
                            .replace("{imgPath}", model.getAvar())
                            .replace("{name}", model.getName())
                            .replace("{env}", String.valueOf(obj.get(0)[0]))
                            .replace("{service}",String.valueOf(obj.get(0)[1]));
                    if (model.getsDict().getEnglish().equals("food")){
                        life_center = life_center.replace("{taste}",life_taste)
                                .replace("{taste}",String.valueOf(String.valueOf(obj.get(0)[2])));
                    }
                    else{
                        life_center = life_center.replace("{taste}","");
                    }
                    life_centers.append(life_center);
                }
            }
        }
        index = index.replace("{bannerstatus}",banner_status_html)
                .replace("{bannerimg}",banner_img_html)
                .replace("{activityImg-1}",acitvity_img_1)
                .replace("{activityImages}",acitvity_imgs)
                .replace("{lifeLeftImage}",life_left)
                .replace("{lifeCenterImage}",life_centers)
                .replace("{lifeRightImage}",life_right);

        try
        {
            writeHtmlFile(filePath,index);
            return true;
        }catch(Exception e){
            return false;
        }
    }

    /**
     * 创建文件并写入数据(index中带数据的标签)
     * @param filePath
     * @param text
     */
    public static File writeHtmlFile(String filePath, String text){
        File file = new File(filePath);
        try{
            FileWriter fw = new FileWriter(file);
            BufferedWriter bw = new BufferedWriter(fw);
            if(!file.exists()){
                file.createNewFile();
                bw.write(text);
            }else{
                bw.write(text);
            }
            bw.flush();
            bw.close();
            fw.close();
        }catch(Exception e){
            System.out.println(e.getMessage());
        }
        return file;
    }
}
