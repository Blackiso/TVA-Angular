export class BillsBasedComponent {

	mHT:any = null;
	tTVA:any = null;
	mTVA:any = 0;
	mTTC:any = 0;

	constructor() { }

	calculate() {
		if (this.tTVA !== '' && this.tTVA !== 0 && this.tTVA !== null && this.mHT !== '' && this.mHT !== 0 && this.mHT !== null) {
			this.mHT =  this.checkFloat(this.mHT);
			this.tTVA = this.checkFloat(this.tTVA);
			this.mTVA = (this.mHT * (this.tTVA / 100)).toFixed(2);
			this.mTTC = (parseFloat(this.mTVA) + parseFloat(this.mHT)).toFixed(2);
		}
	}

	checkFloat(value) {
		value = value.toString();
		if (!isNaN(value) && value.indexOf('.') != -1 && value[value.indexOf('.')+1] !== undefined && value[value.indexOf('.')+2] !== undefined) {
			return parseFloat(value).toFixed(2);
		}
		return value;
	}

}
