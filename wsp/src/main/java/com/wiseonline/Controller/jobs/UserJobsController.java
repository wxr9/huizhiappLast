package com.wiseonline.Controller.jobs;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.Jobs;
import com.wiseonline.Domain.UserJobs;
import com.wiseonline.Service.Impl.JobsServiceImpl;
import com.wiseonline.Service.Impl.UserJobsServiceImpl;
import com.wiseonline.Utils.*;
import org.apache.commons.io.FileUtils;
import org.apache.http.HttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * Created by yanwj on 2016/3/10.
 */
@RestController
@RequestMapping("/Jobs/UserJobs")
public class UserJobsController extends BaseController {

    @Autowired
    UserJobsServiceImpl userJobsService;

    @Autowired
    JobsServiceImpl jobsService;


    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看职位申请列表", module = "前台-职位")
    public PageResult<UserJobs> getAll(@PathVariable int page,
                                       @PathVariable int pageSize, UserJobs Model) {
        PageResult<UserJobs> models = userJobsService.findAll(page, pageSize, Model);
        return models;
    }

    @RequestMapping(value = "My/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看职位申请列表", module = "前台-职位")
    public PageResult<UserJobs> MyGetAll(@PathVariable int page,
                                         @PathVariable int pageSize, UserJobs Model) {
        PageResult<UserJobs> models = userJobsService.findByOneField(page, pageSize, "username", getUserName(), true, "objectid");
        return models;
    }

    @RequestMapping(value = "Apply/List/{jobsId}/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看职位申请列表", module = "前台-职位")
    public PageResult<UserJobs> ApplyGetAll(@PathVariable int page,
                                            @PathVariable int pageSize, UserJobs Model, @PathVariable int jobsId) {
        PageResult<UserJobs> models = userJobsService.findByOneField(page, pageSize, "jobs.objectid", jobsId, true, "objectid", Model);
        return models;
    }

    @RequestMapping(value = "Apply/All/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看职位申请列表", module = "前台-职位")
    public PageResult<UserJobs> ApplyGetAll(@PathVariable int page,
                                            @PathVariable int pageSize, UserJobs Model) {
        PageResult<UserJobs> models = userJobsService.findAll(page, pageSize,Model,true, "objectid");
        return models;
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加职位申请", module = "前台-职位")
    public ResultMessage Add(UserJobs Model, HttpServletRequest request) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            Model.setUsername(username);
            if (Model.getJobsid() != 0) {
                Jobs jobs = jobsService.getbyId(Model.getJobsid());
                Model.setJobs(jobs);
            }
            boolean rst = userJobsService.save(Model);
            if (rst) {
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                return Msg(false, ConstClass.ResultSaveFault);
            }

        } else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑职位申请", module = "前台-职位")
    public UserJobs Edit(@PathVariable int id) {
        UserJobs model = userJobsService.getbyId(id);
        return model;
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新职位申请", module = "前台-职位")
    public ResultMessage Update(UserJobs Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst = userJobsService.update(Model);
            if (rst) {
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                return Msg(false, ConstClass.ResultSaveFault);
            }
        } else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除职位申请", module = "前台-职位")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = userJobsService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "DownloadResume", method = RequestMethod.GET)
    @PermissionInfo(name = "下载简历", module = "后台-职位")
    public ResponseEntity<byte[]> DownloadResume(HttpServletRequest request,HttpServletResponse response) throws IOException, ServletException {
        String ids = request.getParameter("id");
        List<File> fileList = new ArrayList<File>();
        if (ids != null) {
            String[] idArray = ids.split(",");
            for (String id : idArray) {
                UserJobs model = userJobsService.getbyId(Integer.parseInt(id));
                model.setDownloadNum(model.getDownloadNum() + 1);
                userJobsService.update(model);
                if (model.getUrl() != null) {
                    String url = model.getUrl();
                    String[] urlArray = url.split("/");
                    String filedir = request.getSession().getServletContext().getRealPath("/") + url;
                    if (isWindows()) {
                        filedir = filedir.replace("\\", "\\\\");
                        filedir = filedir.replace("/", "\\\\");
                    }else {
                        filedir = filedir.replace("\\","/");
                    }
                    File file = new File(filedir);
                    if (file.exists()) {
                        fileList.add(file);
                    }
                }
            }
        }
        String fileName = UUID.randomUUID().toString() + ".zip";
        //在服务器端创建打包下载的临时文件
        String outFilePath = request.getSession().getServletContext().getRealPath("/") + "static/uploads/ziptemp/";
        createFile(outFilePath, fileName);
        File file = new File(outFilePath + fileName);
        //文件输出流
        FileOutputStream outStream = new FileOutputStream(file);
        //压缩流
        ZipOutputStream toClient = new ZipOutputStream(outStream);
        zipFile(fileList, toClient);
        toClient.close();
        outStream.close();
        this.downloadFile(file, response, true);
        return null;

    }

    //创建文件
    public void createFile(String path,String fileName) {
        //path表示你所创建文件的路径
        File f = new File(path);
        if (!f.exists()) {
            f.mkdirs();
        }
        // fileName表示你创建的文件名；为txt类型；
        File file = new File(f, fileName);
        if (!file.exists()) {
            try {
                file.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /* 压缩文件列表中的文件
    * @param files
    * @param outputStream
    * @throws IOException
    */
    public static void zipFile(List<File> files, ZipOutputStream outputStream) throws IOException,ServletException
    {
        try {
            int size = files.size();
            // 压缩列表中的文件
            for (int i = 0; i < size; i++) {
                File file = (File) files.get(i);
                zipFile(file, outputStream);
            }
        } catch (IOException e) {
            throw e;
        }
    }

    /* 将文件写入到zip文件中
    * @param inputFile
    * @param outputstream
    * @throws Exception
    */
    public static void zipFile(File inputFile, ZipOutputStream outputstream) throws IOException,ServletException
    {
        try {
            if (inputFile.exists()) {
                if (inputFile.isFile()) {
                    FileInputStream inStream = new FileInputStream(inputFile);
                    BufferedInputStream bInStream = new BufferedInputStream(
                            inStream);
                    ZipEntry entry = new ZipEntry(inputFile.getName());
                    outputstream.putNextEntry(entry);


                    final int MAX_BYTE = 10 * 1024 * 1024; // 最大的流为10M
                    long streamTotal = 0; // 接受流的容量
                    int streamNum = 0; // 流需要分开的数量
                    int leaveByte = 0; // 文件剩下的字符数
                    byte[] inOutbyte; // byte数组接受文件的数据


                    streamTotal = bInStream.available(); // 通过available方法取得流的最大字符数
                    streamNum = (int) Math.floor(streamTotal / MAX_BYTE); // 取得流文件需要分开的数量
                    leaveByte = (int) streamTotal % MAX_BYTE; // 分开文件之后,剩余的数量


                    if (streamNum > 0) {
                        for (int j = 0; j < streamNum; ++j) {
                            inOutbyte = new byte[MAX_BYTE];// 读入流,保存在byte数组
                            bInStream.read(inOutbyte, 0, MAX_BYTE);
                            outputstream.write(inOutbyte, 0, MAX_BYTE); // 写出流
                        }
                    }
                    // 写出剩下的流数据
                    inOutbyte = new byte[leaveByte];
                    bInStream.read(inOutbyte, 0, leaveByte);
                    outputstream.write(inOutbyte);
                    outputstream.closeEntry(); // Closes the current ZIP entry
                    // and positions the stream for
                    // writing the next entry
                    bInStream.close(); // 关闭
                    inStream.close();
                }
            } else {
                throw new ServletException("文件不存在！");
            }
        } catch (IOException e) {
            throw e;
        }
    }

    /* 下载文件
    * @param file
    * @param response
    */
    public void downloadFile(File file,HttpServletResponse response,boolean isDelete) {
        try {
            // 以流的形式下载文件。
            BufferedInputStream fis = new BufferedInputStream(new FileInputStream(file.getPath()));
            byte[] buffer = new byte[fis.available()];
            fis.read(buffer);
            fis.close();
            // 清空response
            response.reset();
            OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
            response.setContentType("application/octet-stream");
            response.setHeader("Content-Disposition", "attachment;filename=" + new String(file.getName().getBytes("UTF-8"),"ISO-8859-1"));
            toClient.write(buffer);
            toClient.flush();
            toClient.close();
            if(isDelete)
            {
                file.delete();        //是否将生成的服务器端文件删除
            }
        }
        catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    private boolean isWindows(){
        Properties properties = System.getProperties();
        String os = properties.getProperty("os.name");
        if (os.contains("Windows")||os.contains("Win")||os.contains("windows")||os.contains("win")){
            return true;
        }else {
            return false;
        }
    }

}
