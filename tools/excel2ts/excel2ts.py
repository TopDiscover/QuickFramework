#encoding: utf-8
# -*- coding: UTF-8 -*-

import glob
import datetime
import sys
import os
import codecs
import re
import xlrd
import shutil
import time

rootdir = os.getcwd()
inputdir = os.path.join(rootdir, "tsExcel")
outdir = os.path.join(rootdir, "tsConfig")

## 语言结构
language_list = []

# #中文错误
# reload(sys)
# sys.setdefaultencoding( "utf-8" )

def doRemoveSubDir(targertDir):
    if os.path.exists(targertDir) and os.path.isdir(targertDir) :
        for f in os.listdir(targertDir):  
            subf = os.path.join(targertDir, f)  
            if os.path.isdir(subf) :
                shutil.rmtree(subf,True )
            else:
                os.remove(subf)
            #end if
    
#复制文件
def copyFiles(sourceDir, targetDir):  
    doRemoveSubDir(targetDir)
    time.sleep(0.01)
    if not os.path.exists(targetDir):  
        time.sleep(0.01)
        os.makedirs(targetDir)
    for f in os.listdir(sourceDir):  
        sourceF = os.path.join(sourceDir, f)  
        targetF = os.path.join(targetDir, f)  
        shutil.copyfile(sourceF,targetF)       

# 将数据导出成文件，导出到outdir目录下
def excel2dic(src_excel_path):
    print('[file] %s' % (src_excel_path))
    # load excel data
    excel_data_src = xlrd.open_workbook(src_excel_path, encoding_override = 'utf-8')
    print('[excel] Worksheet name(s):', excel_data_src.sheet_names())
    excel_sheet = excel_data_src.sheet_by_index(0)
    print('[excel] parse sheet: %s (%d row, %d col)' % (excel_sheet.name, excel_sheet.nrows, excel_sheet.ncols))
    
    excel_data_dict = {}

    # 遍历第二行的所有列 存储语言类型
    for col in range(1, excel_sheet.ncols):
        cell_key = excel_sheet.cell(1, col)
        cell_language = excel_sheet.cell(2, col)
        k = cell_key.value
        v = cell_language.value

        # 检查key的唯一性
        bInsert = "false"
        if [k, v] in language_list:
            bInsert = "true"

        # 存储
        if bInsert == "false":
            language_list.append([k, v])

        assert cell_key.ctype == 1, "found a invalid col name in col [%d] !~" % (col)
        assert cell_language.ctype == 1, "found a invalid col name in col [%d] !~" % (col)

    # 剔除第一竖列序号，从第二列开始遍历
    for col in range(1, excel_sheet.ncols):
        key = str(excel_sheet.cell(2, col).value)

        # 检查key的唯一性
        if key in excel_data_dict:
            print('[warning] duplicated data id: "%d", all previous value will be ignored!~' % (key))

        strCol = "{"
        # 剔除表头、语言类型key，从第三行开始遍历
        for row in range(3, excel_sheet.nrows):
            cell_id = excel_sheet.cell(row, 0)
            assert cell_id.ctype == 2, "found a invalid id in row [%d] !~" % (row)

            cell = excel_sheet.cell(row, col)
            if cell.ctype == 0:
                v = '\"\"'
            else:
                v = '\"%s\"' % (cell.value)

            strCol = '%s %d:%s, ' % (strCol, cell_id.value, v)

        excel_data_dict[key] = '%s}' % strCol

    return excel_data_dict


def doBatch():
    #清空outdir
    doRemoveSubDir(outdir)

    excel_data = {}

    print("start exchange excel to ts")
    #解析excel
    dirs = os.listdir(inputdir)
    for filename in dirs:
        sourceFile = os.path.join(inputdir, filename)
        name = str(os.path.splitext(filename)[0])
        excel_data[name] = excel2dic(sourceFile)

    # 遍历excel数据字典 按格式写入
    for k, v in language_list:
        f = "language%s.ts" % k
        targetFile = os.path.join(outdir, f)

        export_file = open(targetFile, 'w')
        export_file = codecs.open(targetFile,"wb+","utf-8")
        export_file.write("export const Language%s = {\n\tlanguage : %s," % (k, v))
        for m, n in excel_data.items():
            export_file.write("\n\t%s : %s," % (m, n[v]))
            
        export_file.write("\n}")
        export_file.close()

    

    # #复制到客户端目录
    copydir = input("请输入迁移目标目录(该目录会被清空):").strip('\r')
    doRemoveSubDir(copydir)
    copyFiles(outdir, copydir)

if __name__ == '__main__':
    doBatch()
    print("all xlsx have been parsed !!!")
    exit(0)