package com.wiseonline.Controller.HuizhiCard;

/**
 * Created by R7tech on 6/6/2016.
 */
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

public class recharge_query_demo
{

    public static void main(String[] args)
    {
        String url = "http://119.90.43.147:28081/recharge/query.do";

        new recharge_query_demo().testPost(url);
    }

    void testPost(String urlStr)
    {
        OutputStreamWriter out = null;
        BufferedReader in = null;
        try
        {
            URL url = new URL(urlStr);
            URLConnection con = url.openConnection();
            con.setDoOutput(true);
            con.setDoInput(true);
            con.setRequestProperty("Pragma:", "no-cache");
            con.setRequestProperty("Cache-Control", "no-cache");
            con.setRequestProperty("Content-Type", "text/xml");

            out = new OutputStreamWriter(con.getOutputStream());
            String xml = "<?xml version=\"1.0\" encoding=\"GBK\"?><B2CReq><merchantNo>000006666666666</merchantNo><cardNo>0000019900000146</cardNo><memberNo>test</memberNo><queryDate>2016-05-16 14:51:00</queryDate></B2CReq>";

            out.write(xml);
            out.flush();
            out.close();
            in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));
            String line = "";
            for (line = in.readLine(); line != null; line = in.readLine())
            {
                System.out.println(line);
            }
        }
        catch (MalformedURLException e)
        {
            e.printStackTrace();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        finally
        {
            try
            {
                if (out != null) out.close();
                if (in != null) in.close();
            }
            catch (IOException ex)
            {
                ex.printStackTrace();
            }
        }
    }
}
