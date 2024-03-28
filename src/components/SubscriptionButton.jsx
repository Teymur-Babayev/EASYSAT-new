import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useAuth } from "../hooks/useAuth";
import { toast } from "../components/ui/use-toast";
import { User as UserCtrl } from "../api/fb.user";
import { SubsCtrl } from "../api/check/fb.subs";
import { useNavigate } from "react-router-dom";

const Subs = new SubsCtrl();
const UserCl = new UserCtrl();
const SubscriptionButton = ({ price, plan }) => {
  const { User ,updateUser} = useAuth();

  const navigate = useNavigate()

  const getPriceInPesos = (price) => {
    let precio;
    let dolarTaza = 0.0501;

    if (price == 579) {
      let pesos = price * dolarTaza;
      precio = pesos.toFixed(2).toString();
    }

    if (price == 749) {
      let pesos = price * dolarTaza;
      precio = pesos.toFixed(2).toString();
    }

    if (price == 1049) {
      let pesos = price * dolarTaza;
      precio = pesos.toFixed(2).toString();
    }

    return precio.toString();
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: getPriceInPesos(price),
            // Esto debería ser el monto de la suscripción.
          },
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    try {
      let fechaActual = new Date();
  
      let fechaDeCreacion = `${fechaActual.getFullYear()}-${String(
        fechaActual.getMonth() + 1
      ).padStart(2, "0")}-${String(fechaActual.getDate()).padStart(2, "0")}`;
  
      // Sumamos 1 mes a la fecha actual
      fechaActual.setMonth(fechaActual.getMonth() + 1);
  
      let fechaDeFinalizacion = `${fechaActual.getFullYear()}-${String(
        fechaActual.getMonth() + 1
      ).padStart(2, "0")}-${String(fechaActual.getDate()).padStart(2, "0")}`;
  
      let subData = {
        uid: User?.uid,
        fechaDeCreacion: fechaDeCreacion,
        fechaDeFinalizacion: fechaDeFinalizacion,
        Plan: plan,
      };
  
      const result = await Subs.createBlog(subData);
      await UserCl.UpdatePlanById(subData.uid,plan);
      await updateUser(subData);
      if(!User?.rfc){
        navigate("/success")
      }else{
        if (result) {
          toast({
            title:`Felicidades Renovaste el plan existosamente`,
          });
        } else {
          console.error("Error al crear el blog");
        }
      }
     
      
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };


  return (
    <>
      <PayPalScriptProvider
        options={{
          "client-id":
            "AaT5PFfdZCnhv-Oxb1fBYHMqUjhLnSTsDUNj5y8fRhPA7Ms1YnbRSfFD-Wec464lzvN08Wa_w_COUXjh",
        }}
      >
        <PayPalButtons
          style={{
            layout: "vertical",
          }}
          createOrder={createOrder}
          onApprove={onApprove}
        />
      </PayPalScriptProvider>
    </>
  );
};

export default SubscriptionButton;
