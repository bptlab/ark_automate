*** Settings ***
Documentation  Our first parsed RPA
Library    RPA.Excel.Files
Library    RPA.Browser

*** Tasks ***
FirstActivity
  Open Workbook  TestString
  Find Empty Row  TestString
ThirdActivity
  Open Browser  TestString  TestString  TestString  true  TestString  TestString  TestString  TestString  TestString
