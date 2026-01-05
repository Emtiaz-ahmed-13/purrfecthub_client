"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Shield, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/lib/config";
import { User } from "@/models/types";
import Link from "next/link";

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
  homeType: z.string().optional(),
  hasOtherPets: z.boolean().optional(),
  otherPetsInfo: z.string().optional(),
  experience: z.string().optional(),
  aboutMe: z.string().optional(),
});

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      homeType: "",
      hasOtherPets: false,
      otherPetsInfo: "",
      experience: "",
      aboutMe: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || token === "undefined") {
        console.warn("No valid token found, redirecting to login.");
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Profile fetch error:", response.status, response.statusText);
          const errorBody = await response.text();
          console.error("Error body:", errorBody);

          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const userObj = data.data?.user || data.user || data;
        console.log("Profile Data:", data);

        setUser(userObj);
        form.reset({
          name: userObj.name || "",
          email: userObj.email || "",
          phone: userObj.phone || "",
          address: userObj.address || "",
          homeType: userObj.homeType || "",
          hasOtherPets: !!userObj.hasOtherPets,
          otherPetsInfo: userObj.otherPetsInfo || "",
          experience: userObj.experience || "",
          aboutMe: userObj.aboutMe || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Could not load profile. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, form]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setSaving(true);
    try {
      const token = localStorage.getItem("accessToken");
      const payload: any = { ...values };
      if (user && values.email === user.email) {
        delete payload.email;
      }

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      setUser(prev => prev ? { ...prev, ...values } : null);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-3xl font-bold tracking-tight">Profile</h3>
          <p className="text-muted-foreground">
            Manage your personal information and account settings.
          </p>
        </div>
        <Separator />

        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <Card className="h-fit">
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{user?.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Shield className="h-3 w-3" /> {user?.role || "User"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground break-all">
                <span className="font-medium text-foreground block mb-1">ID</span>
                {user?.id}
              </div>
            </CardContent>
            <CardFooter>
              <Link href={user?.role === 'SHELTER' ? "/dashboard/shelter" : "/dashboard/adopter"} className="w-full">
                <Button className="w-full" variant="outline">
                  Go to Dashboard
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your name and contact email address.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="Your name" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="email@example.com" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          This is the email address you use to sign in.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 234 567 890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location / Address</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {user?.role === 'ADOPTER' && (
                    <>
                      <Separator className="my-4" />
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-primary uppercase tracking-wider">Adopter Profile</h4>
                        <p className="text-sm text-muted-foreground">
                          This information helps shelters know you better when you apply for adoption.
                        </p>

                        <FormField
                          control={form.control}
                          name="homeType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Home Type</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Apartment, House with garden" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pet Experience</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Tell us about your previous experience with pets..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="otherPetsInfo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Other Pets</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 1 dog, 2 birds..." {...field} />
                              </FormControl>
                              <FormDescription>Do you currently have other pets at home?</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="aboutMe"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>About You</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Share something about yourself and your lifestyle..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
