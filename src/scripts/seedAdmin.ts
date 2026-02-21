import { email } from "better-auth/*";
import { prisma } from "../lib/prisma";
import { UserRole } from "../middleweres/auth";

async function seedAdmin() {
  try {
    const adminData = {
      name: "admin2 shaheb",
      email: "admin2@admin.com",
      role: UserRole.ADMIN,
      password: "admin1234"
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email
      }
    }) 

    if(existingUser) {
      console.error("User already exists!!") 
    }

    const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email",{
      method: "POST",
      headers:{
        "content-Type": "application/json"
      },
      body: JSON.stringify(adminData)
    })
    
  if(signUpAdmin.ok) {
    await prisma.user.update({
      where:{
        email: adminData.email
      },
      data: {
        emailVerified: true
      }
    })
  }


  }catch (error) {
    console.error(error);
  }
}

seedAdmin();