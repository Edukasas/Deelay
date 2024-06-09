package com.edas;

import android.widget.Toast;

// import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.util.Log;
import android.app.usage.UsageEvents;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;

import java.text.SimpleDateFormat;

import android.util.Log;
import java.util.Map;
import java.util.HashMap;
import java.util.Calendar;
import java.util.List;
import java.util.ArrayList;

public class UsageStatsModule extends ReactContextBaseJavaModule {

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  public UsageStatsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "UsageStatsModule";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    // TODO: Add any necessary constants to the module here
    constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }

  private static final SimpleDateFormat dateFormat = new SimpleDateFormat("M-d-yyyy HH:mm:ss");
  public static final String TAG = UsageStatsModule.class.getSimpleName();


  public static List getDates(int durationInDays){
    List dates = getDateRangeFromNow(Calendar.DATE, -(durationInDays));

    return dates;
  }

  public static List getDateRangeFromNow(int field, int amount){
  
    List dates = new ArrayList();
    Calendar calendar = Calendar.getInstance();
    calendar.add(Calendar.DATE, 2);
    long endTime = calendar.getTimeInMillis();
    Calendar calendar2 = Calendar.getInstance();
    calendar2.add(field, amount);
    long startTime = calendar2.getTimeInMillis();


    dates.add(startTime);
    dates.add(endTime);

    return dates;
  }

  public static List<UsageStats> getUsageStatsList(Context context){
    UsageStatsManager usm = (UsageStatsManager) context.getSystemService("usagestats");
    Calendar calendar = Calendar.getInstance();
    long endTime = calendar.getTimeInMillis();
    calendar.add(Calendar.YEAR, -1);
    long startTime = calendar.getTimeInMillis();
  
    Log.d(TAG, "Range start:" + dateFormat.format(startTime) );
    Log.d(TAG, "Range end:" + dateFormat.format(endTime));
  
    List<UsageStats> usageStatsList = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY,startTime,endTime);
    return usageStatsList;
  }

  public static Map<String, UsageStats> getAggregateStatsMap(Context context, double startTime, double endTime){
    UsageStatsManager usm = (UsageStatsManager) context.getSystemService("usagestats");


    Map<String, UsageStats> aggregateStatsMap = usm.queryAndAggregateUsageStats((long)startTime,(long)endTime);
    return aggregateStatsMap;
  }


  public static String getStatsString(Map<String, UsageStats> aggregateStats){
    List appsCollection = new ArrayList();

    for(Map.Entry<String, UsageStats> entry: aggregateStats.entrySet()) {
        String temp = entry.getValue().getPackageName() + ":" + entry.getValue().getTotalTimeVisible();
        appsCollection.add(temp);
    }

    String apps = joinStringList(",", appsCollection);;

    return apps;
  }

  public static String joinStringList(String joiner, List items){
    String joined = new String();

    for(int i = 0; i < items.size(); i++) {
      joined += items.get(i);
      if(i < items.size() - 1){
        joined += joiner;
      }
    }

    return joined;
  }

  @ReactMethod
  public void getStats(
    double startTime,
    double endTime,
    Callback successCallback) {
      if (startTime < endTime) {
        try {
          String stats = getStatsString(getAggregateStatsMap(getReactApplicationContext(), startTime, endTime));

          successCallback.invoke(stats);
        } catch (Exception e) {
          String errorMessage = e.getMessage();
          Toast.makeText(getReactApplicationContext(), errorMessage, Toast.LENGTH_SHORT).show();
        }
      } else {
        String noticeMessage = "Enter start time greather than endtime!";
        Toast.makeText(getReactApplicationContext(), noticeMessage, Toast.LENGTH_SHORT).show();
      }
    }
//   @ReactMethod
// public void getStats(double startTime, double endTime, final Promise promise) {
//       if (startTime < endTime) {
//         try {
//           String stats = getStatsString(getAggregateStatsMap(getReactApplicationContext(), startTime, endTime));

//           promise.resolve(stats);
//         } catch (Exception e) {
//           String errorMessage = e.getMessage();
//           Toast.makeText(getReactApplicationContext(), errorMessage, Toast.LENGTH_SHORT).show();
//           promise.reject("Exception", errorMessage);
//         }
//       } else {
//         String noticeMessage = "Enter start time greather than endtime!";
//         Toast.makeText(getReactApplicationContext(), noticeMessage, Toast.LENGTH_SHORT).show();

//         promise.reject("InvalidTimeRange", noticeMessage);
//       }
//     }
  @ReactMethod
  public void testToast(
    int duration) {
      String test = "It works!";
      Toast.makeText(getReactApplicationContext(), test, duration).show();
    }
  
}