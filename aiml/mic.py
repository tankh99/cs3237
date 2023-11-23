import math
import random

def getJitta(inv_fundamental_frequency):
    gtnbr = len(inv_fundamental_frequency)
    jitta = 0
    for i in range (gtnbr-1):
        jitta += abs(inv_fundamental_frequency[i+1] - inv_fundamental_frequency[i])
        #print(abs(inv_fundamental_frequency[i+1] - inv_fundamental_frequency[i]))
    jitta = jitta / (gtnbr-1)
    return jitta

def getJitt(inv_fundamental_frequency):
    gtnbr = len(inv_fundamental_frequency)
    a = 0
    for i in range (gtnbr):
        a += inv_fundamental_frequency[i]/gtnbr
    jitt = getJitta()/(a)*100
    return jitt

def getRap(inv_fundamental_frequency):
    gtnbr = len(inv_fundamental_frequency)
    rap = 0
    a = 0
    for i in range (gtnbr-2):
        rap += abs(inv_fundamental_frequency[i+1] -(inv_fundamental_frequency[i] + inv_fundamental_frequency[i+1] + inv_fundamental_frequency[i+2])/3)
    for i in range (gtnbr):
        a += inv_fundamental_frequency[i]/gtnbr
    rap /= (gtnbr - 2)
    rap = rap/a*100
    return rap

def getppq5(inv_fundamental_frequency):
    gtnbr = len(inv_fundamental_frequency)
    ppq5 = 0
    a = 0
    for i in range (gtnbr-4):
        ppq5 += abs(inv_fundamental_frequency[i+2] -(inv_fundamental_frequency[i] + inv_fundamental_frequency[i+1] + inv_fundamental_frequency[i+2] + inv_fundamental_frequency[i+3] + inv_fundamental_frequency[i+4])/5)
    for i in range (gtnbr):
        a += inv_fundamental_frequency[i]/gtnbr
    ppq5 /= (gtnbr - 4)
    ppq5 = ppq5/a*100
    return ppq5

def getShdB(inv_fundamental_frequency, peak_to_peak):
    gtnbr = len(inv_fundamental_frequency)
    ShdB = 0
    for i in range (gtnbr-1):
        ShdB += abs(20*math.log10(peak_to_peak[i+1]/peak_to_peak[i]))
    ShdB = ShdB / (gtnbr-1)
    return ShdB

def getShim(inv_fundamental_frequency, peak_to_peak):
    gtnbr = len(inv_fundamental_frequency)
    a = 0
    Shim = 0
    for i in range (gtnbr-1):
        Shim += abs(peak_to_peak[i+1] - peak_to_peak[i])
    Shim /= (gtnbr-1)
    for i in range (gtnbr):
        a += peak_to_peak[i]/gtnbr
    Shim = Shim/(a)*100
    return Shim

def getapq3(inv_fundamental_frequency, peak_to_peak):
    gtnbr = len(inv_fundamental_frequency)
    apq3 = 0
    a = 0
    for i in range (gtnbr-2):
        apq3 += abs(peak_to_peak[i+1] -(peak_to_peak[i] + peak_to_peak[i+1] + peak_to_peak[i+2])/3)
    for i in range (gtnbr):
        a += peak_to_peak[i]/gtnbr
    apq3 /= (gtnbr - 2)
    apq3 = apq3/a*100
    return apq3

def getapq5(inv_fundamental_frequency, peak_to_peak):
    gtnbr = len(inv_fundamental_frequency)
    apq5 = 0
    a = 0
    if gtnbr > 4:
        for i in range (gtnbr-4):
            apq5 += abs(peak_to_peak[i+2] -(peak_to_peak[i] + peak_to_peak[i+1] + peak_to_peak[i+2] + peak_to_peak[i+3] + peak_to_peak[i+4])/5)
        for i in range (gtnbr):
            a += peak_to_peak[i]/gtnbr
        apq5 /= (gtnbr - 4)
        apq5 = apq5/a*100
    else:
        apq5 = "Less than 5 data points"
    return apq5

def getapq11(inv_fundamental_frequency, peak_to_peak):
    gtnbr = len(inv_fundamental_frequency)
    apq11 = 0
    avg11 = 0
    a = 0
    if gtnbr > 10:
        for i in range (gtnbr-10):
            avg11 = 0
            for j in range (11):
                avg11 += peak_to_peak[i+j]
            apq11 += abs(peak_to_peak[i+5] - avg11/11)
        for i in range (gtnbr):
            a += peak_to_peak[i]/gtnbr
        apq11 /= (gtnbr - 10)
        apq11 = apq11/a*100
    else:
        apq11 = "Less than 11 data points"
    return apq11

def get_sound_data(data, parse=False):
    converted = []
    for (peak_to_peak, inv_fundamental_frequency) in data:
        gtnbr = len(inv_fundamental_frequency) #no. of glottis periods
        abs_jitter = getJitta(inv_fundamental_frequency)
        # local_jitter = getJitt(inv_fundamental_frequency)
        rap = getRap(inv_fundamental_frequency)
        ppq5 = getppq5(inv_fundamental_frequency)
        db_shimmer = getShdB(inv_fundamental_frequency, peak_to_peak)
        local_shimmer = getShim(inv_fundamental_frequency, peak_to_peak)
        apq3 = getapq3(inv_fundamental_frequency, peak_to_peak)
        apq5 = getapq5(inv_fundamental_frequency, peak_to_peak)
        apq11 = getapq11(inv_fundamental_frequency, peak_to_peak)
        ddp_jitter = rap*3
        dda_shimmer = apq3*3
        if parse:
            jsonobj =  {
                'jitterAbs': abs_jitter, 
                'jitterRap': rap, 
                'jitterPPQ5': ppq5, 
                'jitterDDP': ddp_jitter, 
                'shimmerLocal': local_shimmer, 
                'shimmerLocalDB': db_shimmer, 
                'shimmerAPQ3': apq3, 
                'shimmerAPQ5': apq5, 
                'shimmerAPQ11': apq11, 
                'shimmerDDA': dda_shimmer
            }
            converted.append(jsonobj)
        else:
            converted.append([abs_jitter, rap, ppq5, ddp_jitter, local_shimmer, db_shimmer, apq3, apq5, apq11, dda_shimmer])
        # return (abs_jitter, rap, ppq5, ddp_jitter, local_shimmer, db_shimmer, apq3, apq5, apq11, dda_shimmer)
    return converted
    
        

