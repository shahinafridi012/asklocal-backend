import axios from "axios";

export const sendMortgageCoachSOAP = async (
  firstName: string,
  lastName: string,
  email: string,
  price: number,
  zipCode: string
) => {
  const date = new Date().toISOString().split("T")[0];

  const propertyTax = price * 0.018;
  const homeownersInsuranceMonthly = 150;
  const homeownersInsuranceAnnual = homeownersInsuranceMonthly * 12;

  const xml = `<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://com.mortgagecoach.edgeinterface">
    <soap:Header>
        <AuthHeader>
            <APIKey>ba974edd92e3d517</APIKey>
            <applicationKey>9611b597c0b805cb34c1</applicationKey>
        </AuthHeader>
    </soap:Header>
    <soap:Body>
        <saveEnterpriseClient xmlns="http://com.mortgagecoach.edgeinterface">
            <reportType>0</reportType>
            <userName>brad@asklocal.com</userName>
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

  const response = await axios.post(
    "https://edge.mortgagecoach.com/EdgeInterface/EdgeInterface.asmx",
    xml,
    {
      headers: {
        "Content-Type": "text/xml",
        "SOAPAction":
          '"http://com.mortgagecoach.edgeinterface/saveEnterpriseClient"',
      },
    }
  );

  console.log("SOAP RESPONSE:");

  return response.data;
};
