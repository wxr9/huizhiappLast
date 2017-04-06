package com.wiseonline.Controller;

import com.wiseonline.Domain.AccessoryManage;
import com.wiseonline.Service.Impl.AccessoryManageServiceImpl;
import com.wiseonline.Utils.ImageHelper;
import com.wiseonline.Utils.PermissionInfo;
import org.apache.commons.collections.map.MultiValueMap;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by yanwj on 2015/11/10.
 */
@RestController
@RequestMapping("/FileUpload")
public class FileUploadController extends BaseController {
    protected final Logger logger = Logger.getLogger(FileUploadController.class);
    private static String[] FILE_TYPE = {".jpeg",".jpg", ".png", ".gif", ".bmp"};
    private static String[] DOC_TYPE = {".doc", ".docx",".xls",".xlsx", ".pdf", ".html", ".zip", ".rar", ".7z", ".iso"};
    private static String[] MATERIAL_TYPE = {".jpeg",".jpg", ".png", ".gif", ".bmp", ".mp3", ".wav", ".wma", ".ogg", ".acc", ".flac", ".amr", ".mp4", ".avi", ".rmvb", ".flv"};
    private static int FILE_MAX_SIZE = 1024 * 1024;

    @Autowired
    AccessoryManageServiceImpl accessoryManageService;

    /**
     * 图片上传
     *
     * @return
     * @throws IOException
     */
    @RequestMapping(value = "AccessoryUploadImgSpecial", produces = "text/html;charset=UTF-8")
    @ResponseBody
    @PermissionInfo(name = "富文本上传图片", module = "公用-富文本编辑器上传图片")
    public String AccessoryUploadImgSpecial(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Content-type", "text/html;charset=UTF-8");
        String callback = request.getParameter("CKEditorFuncNum");
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(
                request.getSession().getServletContext());
        String fileNames = "";
        if (multipartResolver.isMultipart(request)) {
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
            Iterator<String> iter = multiRequest.getFileNames();
            while (iter.hasNext()) {
                MultipartFile file = multiRequest.getFile((String) iter.next());
                if (file != null) {
                    String suffix = file.getOriginalFilename().substring
                            (file.getOriginalFilename().lastIndexOf("."));
                    if (!isDoc(suffix)) {
                        return "<script type=\"text/javascript\">window.parent.CKEDITOR.tools.callFunction(" + callback
                                + ",''," + "'文件格式不正确（必须为.jpg/.gif/.bmp/.png文件）');</script>";
                    }
                    if (!isMax(30,file.getSize())) {
                        return "<script type=\"text/javascript\">window.parent.CKEDITOR.tools.callFunction(" + callback
                                + ",''," + "'上传文件大于30M！');</script>";
                    }
                    String filePath = request.getSession().getServletContext().getRealPath("/") + "static/uploads/images/" + new SimpleDateFormat("yyyyMMdd").format(new Date())+"/";

                    File folder = new File(filePath);
                    if (!(folder.exists() && folder.isDirectory()))
                        folder.mkdirs();
                    //  下面的加的日期是为了防止上传的名字一样
                    String path = filePath
                            + new SimpleDateFormat("yyyyMMddHHmmss")
                            .format(new Date()) + suffix;
                    fileNames = "/static/uploads/images/" + new SimpleDateFormat("yyyyMMdd").format(new Date())+ "/" + new SimpleDateFormat("yyyyMMddHHmmss")
                            .format(new Date()) + suffix;
                    File localFile = new File(path);
                    file.transferTo(localFile);
                } else {
                    return "<script type=\"text/javascript\">window.parent.CKEDITOR.tools.callFunction(" + callback
                            + ",''," + "'上传失败！');</script>";
                }
            }
        }
        return "<script type='text/javascript'>"
                + "window.parent.CKEDITOR.tools.callFunction(" + callback
                + ",'" + fileNames + "',''" + ")" + "</script>";
    }

    /**
     * 图片上传
     *
     * @return
     * @throws IOException
     */
    @RequestMapping(value = "UploadImgSpecial", produces = "text/html;charset=UTF-8")
    @ResponseBody
    @PermissionInfo(name = "富文本上传图片", module = "公用-富文本编辑器上传图片")
    public String UploadImgSpecial(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Content-type", "text/html;charset=UTF-8");
        String callback = request.getParameter("CKEditorFuncNum");
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(
                request.getSession().getServletContext());
        String fileNames = "";
        if (multipartResolver.isMultipart(request)) {
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
            Iterator<String> iter = multiRequest.getFileNames();
            while (iter.hasNext()) {
                MultipartFile file = multiRequest.getFile((String) iter.next());
                if (file != null) {
                    String suffix = file.getOriginalFilename().substring
                            (file.getOriginalFilename().lastIndexOf("."));
                    if (!isPic(suffix)) {
                        return "<script type=\"text/javascript\">window.parent.CKEDITOR.tools.callFunction(" + callback
                                + ",''," + "'文件格式不正确（必须为.jpg/.gif/.bmp/.png文件）');</script>";
                    }
                    if (!isMax(30,file.getSize())) {
                        return "<script type=\"text/javascript\">window.parent.CKEDITOR.tools.callFunction(" + callback
                                + ",''," + "'上传文件大于30M！');</script>";
                    }
                    String filePath = request.getSession().getServletContext().getRealPath("/") + "static/uploads/images/" + new SimpleDateFormat("yyyyMMdd").format(new Date())+"/";

                    File folder = new File(filePath);
                    if (!(folder.exists() && folder.isDirectory()))
                        folder.mkdirs();
                    //  下面的加的日期是为了防止上传的名字一样
                    String path = filePath
                            + new SimpleDateFormat("yyyyMMddHHmmss")
                            .format(new Date()) + suffix;
                    fileNames = "/static/uploads/images/" + new SimpleDateFormat("yyyyMMdd").format(new Date())+ "/" + new SimpleDateFormat("yyyyMMddHHmmss")
                            .format(new Date()) + suffix;
                    File localFile = new File(path);
                    file.transferTo(localFile);
                } else {
                    return "<script type=\"text/javascript\">window.parent.CKEDITOR.tools.callFunction(" + callback
                            + ",''," + "'上传失败！');</script>";
                }
            }
        }
        return "<script type='text/javascript'>"
                + "window.parent.CKEDITOR.tools.callFunction(" + callback
                + ",'" + fileNames + "',''" + ")" + "</script>";
    }

    /**
     * 附件
     *
     * @return
     * @throws IOException
     */
    @RequestMapping(value = "UploadDocSpecial", produces = "text/html;charset=UTF-8")
    @ResponseBody
    @PermissionInfo(name = "富文本上传附件", module = "公用-富文本编辑器上传附件")
    public String UploaddocSpecial(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Content-type", "text/html;charset=UTF-8");
        String callback = request.getParameter("CKEditorFuncNum");
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(
                request.getSession().getServletContext());
        String fileNames = "";
        if (multipartResolver.isMultipart(request)) {
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
            Iterator<String> iter = multiRequest.getFileNames();
            while (iter.hasNext()) {
                MultipartFile file = multiRequest.getFile((String) iter.next());
                if (file != null) {
                    String suffix = file.getOriginalFilename().substring
                            (file.getOriginalFilename().lastIndexOf("."));
                    if (!isDoc(suffix)) {
                        return "<script type=\"text/javascript\">window.parent.CKEDITOR.tools.callFunction(" + callback
                                + ",''," + "'文件格式不正确（必须为.doc, .docx, .xls,.xlsx, .pdf, .html, .zip, .rar, .7z, .iso文件）');</script>";
                    }
                    if (!isMax(30,file.getSize())) {
                        return "<script type=\"text/javascript\">window.parent.CKEDITOR.tools.callFunction(" + callback
                                + ",''," + "'上传文件大于30M！');</script>";
                    }
                    String filePath = request.getSession().getServletContext().getRealPath("/") + "static/uploads/docs/" + new SimpleDateFormat("yyyyMMdd").format(new Date())+"/";

                    File folder = new File(filePath);
                    if (!(folder.exists() && folder.isDirectory()))
                        folder.mkdirs();
                    //  下面的加的日期是为了防止上传的名字一样
                    String path = filePath
                            + new SimpleDateFormat("yyyyMMddHHmmss")
                            .format(new Date()) + suffix;
                    fileNames = "/static/uploads/docs/" + new SimpleDateFormat("yyyyMMdd").format(new Date())+ "/" + new SimpleDateFormat("yyyyMMddHHmmss")
                            .format(new Date()) + suffix;
                    File localFile = new File(path);
                    file.transferTo(localFile);
                } else {
                    return "<script type=\"text/javascript\">window.parent.CKEDITOR.tools.callFunction(" + callback
                            + ",''," + "'上传失败！');</script>";
                }
            }
        }
        return "<script type='text/javascript'>"
                + "window.parent.CKEDITOR.tools.callFunction(" + callback
                + ",'" + fileNames + "',''" + ")" + "</script>";
    }
    /**
     * 普通上传图片
     *
     * @param request
     * @param response
     * @return
     * @throws IOException
     */
    @RequestMapping(value = "UploadImgComm", produces = "text/html;charset=UTF-8", method = RequestMethod.POST)
    @PermissionInfo(name = "普通上传图片", module = "公用-普通上传图片")
    public void UploadImgComm(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Content-type", "text/html;charset=UTF-8");
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(
                request.getSession().getServletContext());
        String fileNames = "";
        List<String> fileList = new ArrayList<String>();
        if (multipartResolver.isMultipart(request)) {
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
            //Iterator<String> iter = multiRequest.getFileNames();
            List<MultipartFile> fList = multiRequest.getFiles("file");
            for (int i=0;i<fList.size();i++){
                Date t = new Date();
                MultipartFile file = fList.get(i);
                if (file != null) {
                    String suffix = file.getOriginalFilename().substring
                            (file.getOriginalFilename().lastIndexOf("."));
                    if (!isPic(suffix)) {
                        String jason = "{\"msg\":\"文件格式不正确（必须为.jpeg/.jpg/.gif/.bmp/.png文件）!\",\"success\":false}";
                        response.getWriter().write(jason);
                        response.getWriter().flush();
                        response.getWriter().close();
                        return;
                    }
                    if (!isMax(30,file.getSize())) {
                        String jason = "{\"msg\":\"上传文件大于30M!\",\"success\":false}";
                        response.getWriter().write(jason);
                        response.getWriter().flush();
                        //response.getWriter().close();
                    }
                    String filePath = request.getSession().getServletContext().getRealPath("/") + "static/uploads/images/" + new SimpleDateFormat("yyyyMMdd").format(t)+"/";
                    //  下面的加的日期是为了防止上传的名字一样
                    String path = filePath
                            + new SimpleDateFormat("yyyyMMddHHmmssSSS")
                            .format(t) + suffix;
                    File folder = new File(filePath);
                    if (!(folder.exists() && folder.isDirectory()))
                        folder.mkdirs();
                    if (fileNames.length() > 0) {
                        fileNames += ";";
                    }

                    String temp = folder.getPath() + "/" + new SimpleDateFormat("yyyyMMddHHmmssSSS")
                            .format(t) + suffix;

                    String returnPath = "static/uploads/images/" + new SimpleDateFormat("yyyyMMdd").format(t)+"/" + new SimpleDateFormat("yyyyMMddHHmmssSSS")
                            .format(t) + suffix;

                    try {
                        File localFile = new File(temp);
                        file.transferTo(localFile);
                        System.out.println("trans");
                        fileList.add(returnPath);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    fileNames += temp;

                } else {
                    String jason = "{\"msg\":\"上传失败\",\"success\":false}";
                    response.getWriter().write(jason);
                    response.getWriter().flush();
                    response.getWriter().close();
                    return;
                }
            }
        }
        JSONArray jsonArray = new JSONArray(fileList);
        JSONObject jo = new JSONObject();
        jo.put("path",jsonArray);
        jo.put("success",true);
        jo.put("msg","上传成功");
        //String jason = "{\"msg\":\"上传成功\",\"success\":true,\"path\":\"" + ret + "\"}";
        response.getWriter().write(jo.toString());
        response.getWriter().flush();
        response.getWriter().close();
    }

    /**
     * 判断是否超过上传文件大小限制
     *
     * @param fileSize
     * @return
     */
    private boolean isMax(int maxSize,long fileSize) {
        if (fileSize > maxSize*FILE_MAX_SIZE) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 是否为图像文件
     *
     * @param suffix
     * @return
     */
    private boolean isPic(String suffix) {
        suffix = suffix.toLowerCase();
        return Arrays.asList(FILE_TYPE).contains(suffix);
    }

    /**
     * 是否为文档文件
     *
     * @param suffix
     * @return
     */
    private boolean isDoc(String suffix) {
        suffix = suffix.toLowerCase();
        return Arrays.asList(DOC_TYPE).contains(suffix);
    }

    private boolean isDoc2(String type,String suffix) {
        suffix = suffix.toLowerCase();
        return type.contains(suffix);
    }

    /**
     * 是否为素材文件
     *
     * @param suffix
     * @return
     */
    private boolean isMaterial(String suffix) {
        suffix = suffix.toLowerCase();
        return Arrays.asList(MATERIAL_TYPE).contains(suffix);
    }

    /**
     *
     */
    @RequestMapping(value = "SimpleUploadFile", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @PermissionInfo(name = "API上传图片", module = "公用-API上传图片")
    public void SimpleUploadFile(HttpServletRequest request, HttpServletResponse response, MultipartFile file, String type) throws IOException {
        response.setHeader("Content-type", "text/html;charset=UTF-8");
        Date t = new Date();
        if (file != null) {
            String suffix = file.getOriginalFilename().substring
                    (file.getOriginalFilename().lastIndexOf("."));
            if (!isPic(suffix)) {
                String jason = "{\"msg\":\"文件格式不正确（必须为.jpeg/.jpg/.gif/.bmp/.png文件）!\",\"success\":false}";
                response.getWriter().write(jason);
                response.getWriter().flush();
                response.getWriter().close();
            }
            if (!isMax(30,file.getSize())) {
                String jason = "{\"msg\":\"上传文件大于30M!\",\"success\":false}";
                response.getWriter().write(jason);
                response.getWriter().flush();
                response.getWriter().close();
            }
            String filePath = request.getSession().getServletContext().getRealPath("/") + "static/uploads/images/" + new SimpleDateFormat("yyyyMMdd").format(new Date())+"/";;
            //  下面的加的日期是为了防止上传的名字一样
            String path = filePath
                    + new SimpleDateFormat("yyyyMMddHHmmssSSS")
                    .format(t) + suffix;
            File folder = new File(filePath);
            if (!(folder.exists() && folder.isDirectory()))
                folder.mkdirs();

            String temp = folder.getPath() + "/" + new SimpleDateFormat("yyyyMMddHHmmssSSS")
                    .format(t) + suffix;

            String returnPath = "static/uploads/images/" + new SimpleDateFormat("yyyyMMdd").format(new Date())+"/" + new SimpleDateFormat("yyyyMMddHHmmssSSS")
                    .format(t) + suffix;

            try {
                File localFile = new File(temp);

                file.transferTo(localFile);
                System.out.println("trans");

                String jason = "{\"msg\":\"上传成功\",\"success\":true,\"path\":\"" + returnPath + "\"}";
                response.getWriter().write(jason);
                response.getWriter().flush();
                response.getWriter().close();

            } catch (Exception e) {
                e.printStackTrace();
            }

        } else {
            String jason = "{\"msg\":\"上传失败\",\"success\":false}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }
        String jason = "{\"msg\":\"上传成功\",\"success\":true}";
        response.getWriter().write(jason);
        response.getWriter().flush();
        response.getWriter().close();
    }

    /**
     *
     */
    @RequestMapping(value = "AccessoryNanageUploadDocFile", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @PermissionInfo(name = "API上传文档", module = "公用-API上传图片")
    public void AccessoryNanageUploadDocFile(HttpServletRequest request, HttpServletResponse response, @RequestParam("file")MultipartFile[] files) throws IOException {
        response.setHeader("Content-type", "text/html;charset=UTF-8");
        int flag = 0;
        int statuFlag = 0;
        for (MultipartFile file:files) {
            if (file != null) {
                String suffix = file.getOriginalFilename().substring
                        (file.getOriginalFilename().lastIndexOf("."));
                String fileName = file.getOriginalFilename().substring(0, file.getOriginalFilename().lastIndexOf("."));
                if (!isDoc(suffix)) {
                    statuFlag = 1;
                    break;
                }
                if (!isMax(30,file.getSize())) {
                    statuFlag = 2;
                    break;
                }
            } else {
                statuFlag = 3;
                break;
            }
        }
        if (statuFlag == 1){
            String jason = "{\"msg\":\"文件格式不正确（必须为doc, docx, pdf, html, zip, rar, 7z, iso文件）!\",\"success\":false}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }else if (statuFlag == 2){
            String jason = "{\"msg\":\"上传文件大于30M!\",\"success\":false}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }else if (statuFlag == 3){
            String jason = "{\"msg\":\"上传失败\",\"success\":false}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }else {
            for (MultipartFile file : files) {
                if (file != null) {
                    String suffix = file.getOriginalFilename().substring
                            (file.getOriginalFilename().lastIndexOf("."));
                    String fileName = file.getOriginalFilename().substring(0, file.getOriginalFilename().lastIndexOf("."));
                    if (!isDoc(suffix)) {
                        String jason = "{\"msg\":\"文件格式不正确（必须为doc, docx, pdf, html, zip, rar, 7z, iso文件）!\",\"success\":false}";
                        response.getWriter().write(jason);
                        response.getWriter().flush();
                        response.getWriter().close();
                        flag = 1;
                    }
                    if (!isMax(30,file.getSize())) {
                        String jason = "{\"msg\":\"上传文件大于30M!\",\"success\":false}";
                        response.getWriter().write(jason);
                        response.getWriter().flush();
                        response.getWriter().close();
                        flag = 1;
                    }
                    String filePath = request.getSession().getServletContext().getRealPath("/") + "static/uploads/docs/" + new SimpleDateFormat("yyyyMMdd").format(new Date())+"/";
                    //  下面的加的日期是为了防止上传的名字一样
                    String path = filePath
                            + new SimpleDateFormat("yyyyMMddHHmmssSSS")
                            .format(new Date()) + suffix;
                    File folder = new File(filePath);
                    if (!(folder.exists() && folder.isDirectory()))
                        folder.mkdirs();

                    String temp = folder.getPath() + "\\" + new SimpleDateFormat("yyyyMMddHHmmssSSS")
                            .format(new Date()) + suffix;

                    String returnPath = "static/uploads/docs/" + new SimpleDateFormat("yyyyMMdd").format(new Date())+"/" + new SimpleDateFormat("yyyyMMddHHmmssSSS")
                            .format(new Date()) + suffix;

                    try {
                        File localFile = new File(temp);

                        file.transferTo(localFile);
                        System.out.println("trans");

                        String jason = "{\"msg\":\"上传成功\",\"success\":true,\"path\":\"" + returnPath + "\"}";
                        response.getWriter().write(jason);
                        response.getWriter().flush();
                        response.getWriter().close();
                        if (flag == 0) {
                            AccessoryManage accessoryManage = new AccessoryManage();
                            accessoryManage.setAuthor(getUserName());
                            accessoryManage.setDeleteFlag(1);
                            accessoryManage.setName(fileName);
                            accessoryManage.setType("accessory");
                            accessoryManage.setUrl(returnPath);
                            accessoryManageService.save(accessoryManage);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                } else {
                    String jason = "{\"msg\":\"上传失败\",\"success\":false}";
                    response.getWriter().write(jason);
                    response.getWriter().flush();
                    response.getWriter().close();
                }
            }
            String jason = "{\"msg\":\"上传成功\",\"success\":true}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }
    }

    /**
     *
     */
    @RequestMapping(value = "AccessoryNanageMaterialUploadDocFile", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @PermissionInfo(name = "API上传文档", module = "公用-API上传图片")
    public void AccessoryNanageMaterialUploadDocFile(HttpServletRequest request, HttpServletResponse response, @RequestParam("file") MultipartFile[] files) throws IOException {
        response.setHeader("Content-type", "text/html;charset=UTF-8");
        int flag = 0;
        int statuFlag = 0;
        for (MultipartFile file : files) {
            if (file != null) {
                String suffix = file.getOriginalFilename().substring
                        (file.getOriginalFilename().lastIndexOf("."));
                String fileName = file.getOriginalFilename().substring(0, file.getOriginalFilename().lastIndexOf("."));
                if (!isMaterial(suffix)) {
                    statuFlag = 1;
                    break;
                }
                if (!isMax(30,file.getSize())) {
                    statuFlag = 2;
                    break;
                }
            } else {
                statuFlag = 3;
            }
        }
        if (statuFlag == 1){
            String jason = "{\"msg\":\"文件格式不正确（必须为jpg, png, gif, bmp, .mp3, wav, wma, ogg, acc, flac, amr, mp4, avi, rmvb, flv文件）!\",\"success\":false}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }else if (statuFlag == 2){
            String jason = "{\"msg\":\"上传文件大于30M!\",\"success\":false}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }else if (statuFlag == 3){
            String jason = "{\"msg\":\"上传失败\",\"success\":false}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }else {
            for (MultipartFile file : files) {
                if (file != null) {
                    String suffix = file.getOriginalFilename().substring
                            (file.getOriginalFilename().lastIndexOf("."));
                    String fileName = file.getOriginalFilename().substring(0, file.getOriginalFilename().lastIndexOf("."));
                    if (!isMaterial(suffix)) {
                        String jason = "{\"msg\":\"文件格式不正确（必须为jpg, png, gif, bmp, .mp3, wav, wma, ogg, acc, flac, amr, mp4, avi, rmvb, flv文件）!\",\"success\":false}";
                        response.getWriter().write(jason);
                        response.getWriter().flush();
                        response.getWriter().close();
                        flag = 1;
                    }
                    if (!isMax(30,file.getSize())) {
                        String jason = "{\"msg\":\"上传文件大于30M!\",\"success\":false}";
                        response.getWriter().write(jason);
                        response.getWriter().flush();
                        response.getWriter().close();
                        flag = 1;
                    }
                    String filePath = request.getSession().getServletContext().getRealPath("/") + "static/uploads/docs/" + new SimpleDateFormat("yyyyMMdd").format(new Date())+"/";
                    //  下面的加的日期是为了防止上传的名字一样
                    String path = filePath
                            + new SimpleDateFormat("yyyyMMddHHmmssSSS")
                            .format(new Date()) + suffix;
                    File folder = new File(filePath);
                    if (!(folder.exists() && folder.isDirectory()))
                        folder.mkdirs();

                    String temp = folder.getPath() + "/" + new SimpleDateFormat("yyyyMMddHHmmssSSS")
                            .format(new Date()) + suffix;

                    String returnPath = "static/uploads/docs/" + new SimpleDateFormat("yyyyMMdd").format(new Date())+"/" + new SimpleDateFormat("yyyyMMddHHmmssSSS")
                            .format(new Date()) + suffix;

                    try {
                        File localFile = new File(temp);

                        file.transferTo(localFile);
                        System.out.println("trans");

                        String jason = "{\"msg\":\"上传成功\",\"success\":true,\"path\":\"" + returnPath + "\"}";
                        response.getWriter().write(jason);
                        response.getWriter().flush();
                        response.getWriter().close();
                        if (flag == 0) {
                            AccessoryManage accessoryManage = new AccessoryManage();
                            accessoryManage.setAuthor(getUserName());
                            accessoryManage.setDeleteFlag(1);
                            accessoryManage.setName(fileName);
                            accessoryManage.setType("material");
                            accessoryManage.setUrl(returnPath);
                            accessoryManageService.save(accessoryManage);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                } else {
                    String jason = "{\"msg\":\"上传失败\",\"success\":false}";
                    response.getWriter().write(jason);
                    response.getWriter().flush();
                    response.getWriter().close();
                }
            }
            String jason = "{\"msg\":\"上传成功\",\"success\":true}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }

    }

    /**
     *
     */
    @RequestMapping(value = "SimpleUploadDocFile", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @PermissionInfo(name = "API上传文档", module = "公用-API上传图片")
    public void SimpleUploadDocFile(HttpServletRequest request, HttpServletResponse response, MultipartFile file, String type,String typeSize) throws IOException {
        response.setHeader("Content-type", "text/html;charset=UTF-8");
        if (file != null) {
            String suffix = file.getOriginalFilename().substring
                    (file.getOriginalFilename().lastIndexOf("."));
            if (!isDoc2(type,suffix)) {
                String jason = "{\"msg\":\"文件格式不正确（必须为"+type+"文件）!\",\"success\":false}";
                response.getWriter().write(jason);
                response.getWriter().flush();
                response.getWriter().close();
            }
            int maxSize = 10;
            try{
                maxSize = Integer.valueOf(typeSize);
            }catch (NumberFormatException e){

            }

            if (!isMax(maxSize,file.getSize())) {
                String jason = "{\"msg\":\"上传文件大于"+maxSize+"M!\",\"success\":false}";
                response.getWriter().write(jason);
                response.getWriter().flush();
                response.getWriter().close();
            }
            String fd = new SimpleDateFormat("yyyyMMdd").format(new Date());
            String fm = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());
            String filePath = request.getSession().getServletContext().getRealPath("/") + "static/uploads/docs/" + fd+"/";
            //  下面的加的日期是为了防止上传的名字一样
            String path = filePath
                    + new SimpleDateFormat("yyyyMMddHHmmssSSS")
                    .format(new Date()) + suffix;
            File folder = new File(filePath);
            if (!(folder.exists() && folder.isDirectory()))
                folder.mkdirs();

            String temp = folder.getPath() + "/" + fm + suffix;

            String returnPath = "static/uploads/docs/" +fd +"/" + fm + suffix;

            try {
                File localFile = new File(temp);

                file.transferTo(localFile);
                System.out.println("trans");

                String jason = "{\"msg\":\"上传成功\",\"success\":true,\"path\":\"" + returnPath + "\"}";
                response.getWriter().write(jason);
                response.getWriter().flush();
                response.getWriter().close();

            } catch (Exception e) {
                e.printStackTrace();
            }

        } else {
            String jason = "{\"msg\":\"上传失败\",\"success\":false}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }
        String jason = "{\"msg\":\"上传成功\",\"success\":true}";
        response.getWriter().write(jason);
        response.getWriter().flush();
        response.getWriter().close();
    }


    @RequestMapping(value = "SimpleUploadFileByCut", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @PermissionInfo(name = "API上传剪栽图片", module = "公用-API上传图片")
    public void SimpleUploadFileByCut(HttpServletRequest request, HttpServletResponse response, MultipartFile file) throws IOException {
        response.setHeader("Content-type", "text/html;charset=UTF-8");
        String x = request.getParameter("x");
        String y = request.getParameter("y");
        String w = request.getParameter("w");
        String h = request.getParameter("h");
        Date t = new Date();
        if (file != null) {
            String suffix = file.getOriginalFilename().substring
                    (file.getOriginalFilename().lastIndexOf("."));
            if (!isPic(suffix)) {
                String jason = "{\"msg\":\"文件格式不正确（必须为.jpeg/.jpg/.gif/.bmp/.png文件）!\",\"success\":false}";
                response.getWriter().write(jason);
                response.getWriter().flush();
                response.getWriter().close();
            }
            if (!isMax(30,file.getSize())) {
                String jason = "{\"msg\":\"上传文件大于30M!\",\"success\":false}";
                response.getWriter().write(jason);
                response.getWriter().flush();
                response.getWriter().close();
            }
            String filePath = request.getSession().getServletContext().getRealPath("/") + "static/uploads/images/" + new SimpleDateFormat("yyyyMMdd").format(new Date())+"/";;
            //  下面的加的日期是为了防止上传的名字一样
            String path = filePath
                    + new SimpleDateFormat("yyyyMMddHHmmssSSS")
                    .format(t) + suffix;
            File folder = new File(filePath);
            if (!(folder.exists() && folder.isDirectory()))
                folder.mkdirs();

            String temp = folder.getPath() + "/" + new SimpleDateFormat("yyyyMMddHHmmssSSS")
                    .format(t) + suffix;

            String src = folder.getPath() + "/" + file.getOriginalFilename();

            String returnPath = "static/uploads/images/" + new SimpleDateFormat("yyyyMMdd").format(new Date())+"/" + new SimpleDateFormat("yyyyMMddHHmmssSSS")
                    .format(t) + suffix;

            try {
                File localFile = new File(src);

                file.transferTo(localFile);

                ImageHelper.cutImage(src,temp,Integer.valueOf(x),Integer.valueOf(y),Integer.valueOf(w),Integer.valueOf(h));
                System.out.println("trans");

                String jason = "{\"msg\":\"上传成功\",\"success\":true,\"path\":\"" + returnPath + "\"}";
                response.getWriter().write(jason);
                response.getWriter().flush();
                response.getWriter().close();

            } catch (Exception e) {
                e.printStackTrace();
                response.getWriter().write(e.getMessage());
                response.getWriter().flush();
                response.getWriter().close();
            }

        } else {
            String jason = "{\"msg\":\"上传失败\",\"success\":false}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }
        String jason = "{\"msg\":\"上传成功\",\"success\":true}";
        response.getWriter().write(jason);
        response.getWriter().flush();
        response.getWriter().close();
    }
}
