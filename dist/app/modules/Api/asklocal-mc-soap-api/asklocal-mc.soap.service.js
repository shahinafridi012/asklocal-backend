"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMortgageCoachSOAP = void 0;
const axios_1 = __importDefault(require("axios"));
const sendMortgageCoachSOAP = async (firstName, lastName, email, price, zipCode) => {
    const date = new Date().toISOString().split("T")[0];
    const API_KEY = process.env.MC_API_KEY;
    const APP_KEY = process.env.MC_APP_KEY;
    const USERNAME = process.env.MC_USERNAME;
    const propertyTax = price * 0.018;
    const homeownersInsuranceMonthly = 150;
    const homeownersInsuranceAnnual = homeownersInsuranceMonthly * 12;
    const xml = `<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://com.mortgagecoach.edgeinterface">
    <soap:Header>
        <AuthHeader>
            <APIKey>${API_KEY}</APIKey>
            <applicationKey>${APP_KEY}</applicationKey>
        </AuthHeader>
    </soap:Header>
    <soap:Body>
        <saveEnterpriseClient xmlns="http://com.mortgagecoach.edgeinterface">
            <reportType>0</reportType>
            <userName>${USERNAME}</userName>
            <client>
                <clientId xsi:nil="true"/>
                <contact>
                    <contactId xsi:nil="true"/>
                    <userId xsi:nil="true"/>
                    <firstName>${firstName}</firstName>
                    <lastName>${lastName}</lastName>
                    <email>${email}</email>
                    <analysis>
                        <analysisId xsi:nil="true"/>
                        <contactId xsi:nil="true"/>
                        <isAutomation>true</isAutomation>
                        <property>
                            <propertyId xsi:nil="true"/>
                            <address>
                                <AddressId xsi:nil="true"/>
                                <StreetAddress></StreetAddress>
                                <Zip>${zipCode}</Zip>
                            </address>
                            <propertyValue>${price}</propertyValue>
                            <hoaDues>0</hoaDues>
                        </property>
                        <loanProducts>
                            <LoanProduct>
                                <loanProductId xsi:nil="true" />
                                <productName>Conv 5% Down</productName>
                                <firstTd>
                                    <loanId xsi:nil="true" />
                                    <trustDeed>1</trustDeed>
                                    <purchasePriceOrPropertyValue>${price}</purchasePriceOrPropertyValue>
                                    <downPaymentPercent>.05</downPaymentPercent>
                                    <loanType>0</loanType>
                                    <term>360</term>
                                    <miPercent>.0019</miPercent>
                                    <miCutoffPercent>.78</miCutoffPercent>
                                    <propertyTax>${propertyTax}</propertyTax>
                                    <propertyTaxPercent>1.8</propertyTaxPercent>
                                    <hazardInsuranceAmount>150.00</hazardInsuranceAmount>
                                </firstTd>
                                <reportFlag>15</reportFlag>
                                <useOBFixedMarketRate>true</useOBFixedMarketRate>
                            </LoanProduct>

                            <LoanProduct>
                                <loanProductId xsi:nil="true" />
                                <productName>Conv 10% Down</productName>
                                <firstTd>
                                    <loanId xsi:nil="true" />
                                    <trustDeed>1</trustDeed>
                                    <purchasePriceOrPropertyValue>${price}</purchasePriceOrPropertyValue>
                                    <downPaymentPercent>.1</downPaymentPercent>
                                    <loanType>0</loanType>
                                    <term>360</term>
                                    <miPercent>.0015</miPercent>
                                    <miCutoffPercent>.78</miCutoffPercent>
                                    <propertyTax>${propertyTax}</propertyTax>
                                    <propertyTaxPercent>1.8</propertyTaxPercent>
                                    <hazardInsurance>150</hazardInsurance>
                                    <hazardInsuranceMonthly>${homeownersInsuranceMonthly}</hazardInsuranceMonthly>
                                    <hazardInsuranceAnnual>${homeownersInsuranceAnnual}</hazardInsuranceAnnual>
                                </firstTd>
                                <reportFlag>15</reportFlag>
                                <useOBFixedMarketRate>true</useOBFixedMarketRate>
                            </LoanProduct>

                            <LoanProduct>
                                <loanProductId xsi:nil="true" />
                                <productName>Conv 20% Down</productName>
                                <firstTd>
                                    <loanId xsi:nil="true" />
                                    <trustDeed>1</trustDeed>
                                    <purchasePriceOrPropertyValue>${price}</purchasePriceOrPropertyValue>
                                    <downPaymentPercent>.2</downPaymentPercent>
                                    <loanType>0</loanType>
                                    <term>360</term>
                                    <propertyTax>${propertyTax}</propertyTax>
                                    <propertyTaxPercent>1.8</propertyTaxPercent>
                                    <hazardInsurance>150</hazardInsurance>
                                    <hazardInsuranceMonthly>${homeownersInsuranceMonthly}</hazardInsuranceMonthly>
                                    <hazardInsuranceAnnual>${homeownersInsuranceAnnual}</hazardInsuranceAnnual>
                                </firstTd>
                                <reportFlag>15</reportFlag>
                                <useOBFixedMarketRate>true</useOBFixedMarketRate>
                            </LoanProduct>

                            <LoanProduct>
                                <loanProductId xsi:nil="true" />
                                <productName>FHA 3.5% Down</productName>
                                <firstTd>
                                    <loanId xsi:nil="true" />
                                    <trustDeed>1</trustDeed>
                                    <purchasePriceOrPropertyValue>${price}</purchasePriceOrPropertyValue>
                                    <downPaymentPercent>.035</downPaymentPercent>
                                    <loanType>0</loanType>
                                    <term>360</term>
                                    <upfrontPremiumType>1</upfrontPremiumType>
                                    <upfrontMIPPercent>.0175</upfrontMIPPercent>
                                    <addUpfrontMIPToLoanAmount>true</addUpfrontMIPToLoanAmount>
                                    <miPercent>.0055</miPercent>
                                    <miCalcedOnBalance>true</miCalcedOnBalance>
                                    <propertyTax>${propertyTax}</propertyTax>
                                    <propertyTaxPercent>1.8</propertyTaxPercent>
                                    <hazardInsuranceMonthly>${homeownersInsuranceMonthly}</hazardInsuranceMonthly>
                                    <hazardInsuranceAnnual>${homeownersInsuranceAnnual}</hazardInsuranceAnnual>
                                </firstTd>
                                <reportFlag>15</reportFlag>
                                <useOBFixedMarketRate>true</useOBFixedMarketRate>
                            </LoanProduct>
                        </loanProducts>

                        <reports>
                            <AnalysisReport>
                                <reportId xsi:nil="true" />
                                <reportType>0</reportType>
                                <sendReadReceipt>true</sendReadReceipt>
                                <quoteDate>${date}</quoteDate>
                                <midTermMonths>60</midTermMonths>
                                <longTermMonths>180</longTermMonths>
                                <longTermChartType>2</longTermChartType>
                            </AnalysisReport>
                        </reports>
                    </analysis>
                </contact>
            </client>
        </saveEnterpriseClient>
    </soap:Body>
</soap:Envelope>`;
    const response = await axios_1.default.post("https://edge.mortgagecoach.com/EdgeInterface/EdgeInterface.asmx", xml, {
        headers: {
            "Content-Type": "text/xml",
            "SOAPAction": '"http://com.mortgagecoach.edgeinterface/saveEnterpriseClient"',
        },
    });
    console.log("SOAP RESPONSE:", response.data);
    return response.data;
};
exports.sendMortgageCoachSOAP = sendMortgageCoachSOAP;
