"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/fileuploader";
import { ValidationForPosts } from "@/lib/validation";
import {Models} from "appwrite"
import { createPost, fetchCurrentUserData } from "@/lib/appwrite/api";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";

type props = {
    post?: Models.Document;
}

const currentUserDetails = await fetchCurrentUserData();
const userId = currentUserDetails?.$id;
console.log(userId)


const formToPost = ({ post } : props) => {
    const { toast } = useToast();
    const navigate = useNavigate();
  const form = useForm<z.infer<typeof ValidationForPosts>>({
    resolver: zodResolver(ValidationForPosts),
    defaultValues: {
        caption: post ? post?.caption : "",
        location: post ? post?.location : "",
        file: [],
        tags: post ? post?.tags.join(',') : "",

    },
  });

  // 2. Define a submit handler.
async function onSubmit(values: z.infer<typeof ValidationForPosts>) {
    const newPictureToPost = await createPost(
            {
                caption: values.caption,
                file: values.file,
                location: values.location,
                tags: values.tags,
                userId: userId,
            }
    );
    if(!newPictureToPost){
        toast({title : "Did you try to post a picture?"})
    }
    toast({title : "Picture posted successfully"})
    navigate('/')
}
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photo</FormLabel>
              <FormControl>
                <FileUploader 
                    fieldChange = {field.onChange}
                    mediaUrl = {post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Where Are You?</FormLabel>
              <FormControl>
              <Input type="text" className="shad-input" {...field}/>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Any hashtags?</FormLabel>
              <FormControl>
                <Input type="text" placeholder="#ascweek2024, #acceleratedsemester, #hmm" className="shad-input" {...field}/>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-center">
        <Button type="button" className='shad-button_dark_4'>Abort</Button>
        <Button type="submit" className='shad-button_primary whitespace-nowrap'>Submit</Button>
        </div>
      </form>
    </Form>
  );
};
export default formToPost;
