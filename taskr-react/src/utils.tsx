import { Temporal } from "@js-temporal/polyfill";
import { IOrder } from "./interfaces/IOrder";

const validateEmail = (email:string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

const verifyPassword = (password:string,sdpassword:string) => {
    return password === sdpassword
}

const validatePhone = (phone:string) => {
  return String(phone)
  .toLowerCase()
  .match(
        /^[0-9]+$/
      );
}

const validateName = (name:string) => {
  const nameRegex = /^[a-zA-Z\s-]+$/;
  return nameRegex.test(name);
};


const validateVisaCardNumber = (cardNumber:string) => {
  
  const visaRegex = /^[0-9]{16}$/;
  return visaRegex.test(cardNumber);
};


const validateVisaExpiryDate = (expiryDate:string) => {
  const expiryRegex = /^[0-9]{2}\/[0-9]{2}$/;
  return expiryRegex.test(expiryDate);
};

const validateVisaCVV = (cvv:string) => {
  const cvvRegex = /^[0-9]{3}$/;
  return cvvRegex.test(cvv);
};



function formatDateYMD(birthDate: Date) {
  const date = new Date(birthDate)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let monthS : String
  if (month < 10){
      monthS = "0" + month
  } else {
      monthS = "" + month
  }

  let day : String
  if (date.getDate() < 10){
      day = "0" + date.getDate()
  } else {
      day = "" + date.getDate()
  }
  return year+"-"+ monthS+"-"+ day
}

const formatDateHour = (dateHour: Date) => {
  const date = new Date(dateHour)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let monthS : string
  if (month < 10){
      monthS = "0" + month
  } else {
      monthS = "" + month
  }

  let day : string
  if (date.getDate() < 10){
      day = "0" + date.getDate()
  } else {
      day = "" + date.getDate()
  }
  let hour : string
  if (date.getHours() < 10){
    hour = "0" + date.getHours()
  } else {
    hour = "" + date.getHours()
  }
  let minutes : string
  if (date.getMinutes() < 10){
    minutes = "0" + date.getMinutes()
  }else {
    minutes = "" + date.getMinutes()
  }
  return day+"/"+ monthS+"/"+year+ " "+hour+":"+minutes
}

const durationToString = (expectedDuration:string) => {
  const duration = Temporal.Duration.from(expectedDuration);
  if (duration.minutes == 0){
    return duration.hours + "h";
  }
  else {
    if (duration.minutes < 10){
      return duration.hours + ":0" +duration.minutes + "h";
    }else {
      return duration.hours + ":" +duration.minutes + "h";
    }
  }

}


const priceFinal = (expectedDuration:string,pricePerHour:number) => {
  const duration = Temporal.Duration.from(expectedDuration);
  var minutes = duration.minutes / 60
  var hour = duration.hours + minutes
  console.log("minutes",minutes)
  var price = pricePerHour * hour
  return price.toFixed(2)
}

const readImage = (selectedImage: File): Promise<string | ArrayBuffer | null> => {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onloadend = () => {
      const base64Image = reader.result;
      resolve(base64Image);
    };
    reader.onerror = (error) => reject(error);
  });
};

function orderList(list:IOrder[]) {
    list.sort((orderA: IOrder, orderB: IOrder) => {
      const dateHourA = new Date(orderA.datehour)
      const dateHourB = new Date(orderB.datehour)

      if (dateHourA < dateHourB) {
        return -1;
      } else if (dateHourA > dateHourB) {
        return 1;
      } else {
          return 0
      }
    })

    console.log(list)
    return list

}

export {validateEmail, verifyPassword,formatDateHour,formatDateYMD,durationToString,priceFinal,validatePhone,readImage,orderList, validateName, validateVisaCardNumber, validateVisaExpiryDate, validateVisaCVV}
