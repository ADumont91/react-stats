import React from 'react';
import { Container, Row, Col, Card, CardHeader, CardTitle, CardImg, CardBody, CardFooter, Button } from 'shards-react';
import { CSVReader, readString } from 'react-papaparse'
import * as ss from 'simple-statistics';
import * as ssf from 'simple-sales-forecasting';
class App extends React.Component {

	constructor(props) {
        super(props);

        this.state = {
			fileData: {},
			costPrices: [],
			salesPrices: [],
			priceDifferences: [],
			greatestPriceDiff: 0,
			promos: [[],[],[]]
		};
		
		this.handleOnDrop = this.handleOnDrop.bind(this);
		this.handleOnError = this.handleOnError.bind(this);
		this.handleOnRemoveFile = this.handleOnRemoveFile.bind(this);
		this.processData = this.processData.bind(this);
    }
	componentDidMount() {
		
	}

	handleOnDrop(data) {
		// Save data from the file into the object state.
		/*console.log('---------------------------')
		console.log(data)
		console.log('---------------------------')*/
		this.setState({
			fileData:data
		});
	  }
	
	  handleOnError(err, file, inputElem, reason) {
		console.log(err)
	  }
	
	  handleOnRemoveFile(data) {
		
		/*console.log('---------------------------')
		console.log(data)
		console.log('---------------------------')*/
	  }

	  processData() {
		//const result = readString(this.state.fileData);
		//console.log(result);

		const dataToProcess = this.state.fileData;
		const costPrice = [];
		const salesPrice = [];
		const priceDifference = [];
		const dataQuantities = [];

		dataToProcess.map((item,i) => {
			costPrice[i] = Math.round(item.data.Cost/item.data.Quantity);
			salesPrice[i] = Math.round(item.data.Sales/item.data.Quantity);
			priceDifference[i] = salesPrice[i] - costPrice[i];
			dataQuantities[i] = item.data.Quantity;
		});
		const greatestDiff = ss.min(priceDifference);

		this.setState({
			costPrices: costPrice,
			salesPrices: salesPrice,
			priceDifferences: priceDifference,
			greatestPriceDiff: greatestDiff
		});

		var promoStart = 0;
		var promoEnd = 0;
		var m = 0;
		const promos = [];

		priceDifference.map((item,i) => {
			if (item == greatestDiff){
				var j = i;
				var k = i;
				while(priceDifference[j] < 0) {
					j = j - 1;
				}
				while(priceDifference[k] < 0) {
					k = k + 1;
				}
				j = j + 1;
				k = k - 1;
				if(promoStart != j){
					promoStart = j;
					promoEnd = k;

					promos[m] = [promoStart,promoEnd];

					this.setState({
						promos: promos
					});
					m = m + 1
					
				};
			}
		})

		const promo1Points = this.state.promos[0];
		const promo1Start = promo1Points[0];
		const promo1End = promo1Points[1];
		const promo1 = [];
		const promo1Data = [];
		const beforePromo = [];
		const promoSalesPrices = [];
		const promoQuantities = [];
		const beforePromoSalesPrices = [];
		const beforePromoQuantities = [];
		var n;
		var q;
		var len = promo1End - promo1Start;
		for(n = 0; n <= len; n++) {
			q = promo1Start + n;
			promo1[n] = [q, salesPrice[q]];
			promo1Data[n] = [q, costPrice[q], dataToProcess[q].data.Quantity];
			beforePromo[n] = [q, costPrice[q-len-1], dataToProcess[q-len-1].data.Quantity];
			promoSalesPrices[n] = salesPrice[q];
			promoQuantities[n] = dataToProcess[q].data.Quantity;
			beforePromoSalesPrices[n] = salesPrice[q-len-1];
			beforePromoQuantities[n] = dataToProcess[q-len-1].data.Quantity;
		}

		const modePromoSalesPrice = ss.mode(promoSalesPrices);
		const modeBeforeSalesPrice = ss.mode(beforePromoSalesPrices);
		const averagePromoQuantity = ss.average(promoQuantities);
		const averageBeforeQuantity = ss.average(beforePromoQuantities);
		const sdvPromoQuantity = ss.standardDeviation(promoQuantities);

		const PED = ((averageBeforeQuantity - averagePromoQuantity) / averageBeforeQuantity) / ((modeBeforeSalesPrice - modePromoSalesPrice) / modeBeforeSalesPrice);
		const AE = (modeBeforeSalesPrice + modePromoSalesPrice) / (averageBeforeQuantity + averagePromoQuantity) * (averageBeforeQuantity - averagePromoQuantity) / (modeBeforeSalesPrice - modePromoSalesPrice);
		
		console.log(PED, AE);

		const latestQuantities = [];
		const latestSalesPrices = [];
		n = 0;
		for(n = 0; n < len - 1; n++) { 
			latestQuantities[n] = dataToProcess[dataToProcess.length - len + n].data.Quantity;
			latestSalesPrices[n] = salesPrice[dataToProcess.length - len + n];
		};

		const averageLatestQuantities = ss.average(latestQuantities);
		const modeLatestSalesPrice = ss.mode(latestSalesPrices);

		const newPromoQuantities = dataQuantities;
		const newBeforeQuantities = dataQuantities;
		const forecastSales = [];
		n = 0;
		var pos = newPromoQuantities.length;
		for(n = 0; n < len*6; n++) {
			newPromoQuantities[pos + n] = averageLatestQuantities + (PED / modeLatestSalesPrice * averageLatestQuantities * (modePromoSalesPrice - modeLatestSalesPrice) + Math.random(100) * sdvPromoQuantity);
			newBeforeQuantities[pos + n] = averageLatestQuantities + (PED / modeLatestSalesPrice * averageLatestQuantities * (modeBeforeSalesPrice - modeLatestSalesPrice) + Math.random(100) * sdvPromoQuantity);
			forecastSales[n] = averageLatestQuantities + (PED / modeLatestSalesPrice * averageLatestQuantities * (modePromoSalesPrice - modeLatestSalesPrice) + Math.random(100) * sdvPromoQuantity);
		}

		console.log(ss.average(forecastSales), ss.standardDeviation(forecastSales));

	}

    render() {
		
        return (
			<div>
				<Container style={{ width:"100vw", height:"88vh"}}>
					<Row style={{height:"3vh"}}></Row>
					<Row>
						<Col>
							<Card className="border-bottom text-center">
								<CardHeader>
									<Row>
										<Col>
											<h5>Decision Inc. Case Study Assignment</h5>
										</Col>
										<Col>
											<h5 className="text-right">by: Arnold Dumont</h5>
										</Col>
									</Row>
								</CardHeader>
								<CardImg className="mb-3 mx-auto" style={{ maxWidth:"200px" }} src="https://www.prntr.com/images/calculator-clipart-1.jpg">

								</CardImg>
								<CardBody>
									<CardTitle>Introduction</CardTitle>
									<p className="text-left">Sales data is a mine of information that is rich in trends and correlations that can be used to improve sales.
									However, these trends and correlations need some statistical processing to make sense of.
									One of the factors that is important in these calculations is price elasticity, which describes the dynamic correlation between sales quantity and price.
									Also, a sales forecast can be made using a known price elasticity.</p>

									<CardTitle>Objectives</CardTitle>
									<p className="text-left">The first objective of the report is to calculate a daily sales and cost prices.<br></br>
									The second objective of the report is to summarise the success of using statistical analysis to identify a price elasticity during a sales promotion.<br></br>
									The third objective of the report is to present a 3-month sales forecast at the promotional price and at the non-promotional price. </p>
									
									<CardTitle>Requirements</CardTitle>
									<p className="text-left">The following requirements were taken into account:</p>
									<ul className="text-left">
										<li>A relevant statistical modelling language must be used to perform modelling, such as R and Python.<br></br>
											Javascript was selected due to its speed and ability when handling asynchronous tasks and real-time data.
											Javascript light-weight and can run on any device through a browser.
											Read more about Javascript for data science in <a target="_blank" href="https://towardsdatascience.com/top-programming-languages-for-data-science-in-2020-3425d756e2a7?gi=944c7d6d1f25">this article</a>.</li>
											
										<li>All workings must be shown, such as forecasting methods, interpolation, extrapolation.<br></br>
										</li>
									</ul>
									
									<CardTitle>Approach & Results</CardTitle>
									<p className="text-left">The following approach was taken to complete the assignment:</p>
									<ol className="text-left">
										<li>A boilerplate React app with webpack as the module bundler and shardsUI as the CSS library was used as a framework.
											The simple-statistics.js library is used to do statistical calculations and the canvas.js library is used to display the results.
										</li>
										<li>Sales data provided by Decision Inc. is processed into a JSON object using the react-papaparse library file upload:
											<CSVReader
												onDrop={this.handleOnDrop}
												onError={this.handleOnError}
												addRemoveButton
												onRemoveFile={this.handleOnRemoveFile}
												config={{header: true, dynamicTyping:true}}
											>
											<span>Drop CSV file here or click to upload.</span>
											</CSVReader>
										</li>
										<li>Daily Cost & Sales prices per unit are calculated (rounded to the closest Rand) by dividing the Cost and Sales fields by the quantity field.</li>
										<li>The difference between the Cost and Sales price is calculated for each day.
											This is then used to find a time period at which the product was sold at a promotional price by finding the greatest negative difference. 
											The time period of the promotion is found by looking for the closest positive difference in sales and cost prices.</li>
										<li>Average sales before the promotion and during the promotion are used to calculate the PED (elastic price of demand) and AE (arc elastic).<br></br>
											PED formula: <CardImg src="https://wikimedia.org/api/rest_v1/media/math/render/svg/10e92eab96aec618fd9a0fb78b74a4942c299b01"></CardImg><br></br>
											PED was found to be: -32.76<br></br>
											AE formula: <CardImg src="https://wikimedia.org/api/rest_v1/media/math/render/svg/997e244a6b68f219748f282047efd885725ff7fe"></CardImg><br></br>
											AE was found to be: -8.59
										</li>
										<li>The PED is then used to forecast sales values 3 months from the last data point in the sales data set for the promotional price and the non-promotional sales price.<br></br>
											The average promotional sales quantity for the next 3 months is 21369 units with a standard deviation of 803 units.
											The average non-promotional sales quantity for the next 3 months is 8244 units with a standard deviation of 715 units.
										</li>
									</ol>
									<Button theme="secondary" onClick={this.processData}>Process Data</Button>

								</CardBody>
								<CardFooter>

								</CardFooter>
							</Card>
						</Col>
					</Row>
				</Container>
			</div>
        );
    }
};

export { App };