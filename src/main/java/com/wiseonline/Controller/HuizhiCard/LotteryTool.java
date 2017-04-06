package com.wiseonline.Controller.HuizhiCard;

/**
 * Created by R7tech on 10/13/2016.
 */

import java.util.Random;

public class LotteryTool {


    private double factor;

    private double probability;

    private Random rand;

    private int total;

    private static LotteryTool ins;


    private LotteryTool(double probability,int total) {

        //this.factor = (double) System.currentTimeMillis() / expireTime;
        this.probability = probability;
        this.rand = new Random(System.currentTimeMillis());
        this.total = total;
        this.factor = 1/probability;
    }

    public static LotteryTool getInstance(double probability, int totalUser) {
        if (ins==null){
            ins = new LotteryTool(probability,totalUser);
        }else {
            ins.probability = probability;
            ins.total = totalUser;
            ins.factor = 1/probability;
        }
        return ins;

    }



    public boolean isLucky(int expected) {
        double max = expected + this.factor/2;
        double min = expected - this.factor/2;
        int token = rand.nextInt((int)Math.floor(max-min)+1)+(int)min;
        if (expected == token || probability>0.95) {
            return true;
        }
        return false;
    }

    public static void main(String args[]){
        for (int i=0;i<100;i++){
            if (LotteryTool.getInstance(0.4,1000000000).isLucky(75))
            {
                System.out.println("bingo"+i);
            }
        }

    }
}
