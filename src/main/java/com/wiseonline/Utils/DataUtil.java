package com.wiseonline.Utils;



public class DataUtil {
	/**
	 * 将double值改为四位字符串 例：60.00-->0060 120.00-->0120
	 * 
	 * @param fee
	 * @return
	 */
	public static String getMoneyStr(double fee) {
		int i = (int) Math.round(fee);
		return String.format("%04d", i);
	}

	/*
	 * 将明文密码进行二次加密
	 */
	public static String encryptionPw(String password) {
		MD5 md5 = new MD5();
		return SecondaryInfilling.encrypt(md5.getMD5ofStr(password).substring(15, 30));
	}

	/*
	 * 将二次加密密码转换成一次加密密码
	 */
	public static String decryptPw(String encryptionPwd) {
		return SecondaryInfilling.decrypt(encryptionPwd);
	}

	public static void main(String[] args) {
		// System.out.println(DataUtil.getMoneyStr(120.00));
		// System.out.println(DataUtil.encryptionPw("nothing"));
		// System.out.println("二次加密 to MD5:"+DataUtil.decryptPw(DataUtil.encryptionPw("nothing")));
		// System.out.println("nothing to MD5:"+new
		// MD5().getMD5ofStr("nothing").substring(15, 30));
		long i = 9999;
		System.out.println(String.format("%08d", i));
		System.out.println(DataUtil.encryptionPw("admin"));
	}
}
