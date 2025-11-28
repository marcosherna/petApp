import { View, StyleSheet } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageCircleQuestionMark } from "lucide-react-native";
import {
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultFooterProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types";

import { IconButton, Label, PressableLayout } from "../../components";
import {
  Avatar,
  EmptyTemplate,
  GestureIconButton,
  Layout,
  LoadingTemplate,
} from "../../components/ui";

import { spacing } from "../../resourses/spacing";
import { iconography } from "../../resourses/iconography";
import { timeAgo } from "../../helpers/date";

import { useTheme } from "../../hooks/useTheme";
import { useProduct } from "../../hooks/useProduct";
import { useAuth } from "../../hooks/useAuth";

import { Comment } from "../../network/models/Comment";
import {
  subscribeToComentsByProductId,
  addComment,
  getCommentsByProductId,
} from "../../network/services/CommentToProduct";

interface CommentSheetFooterProps extends BottomSheetDefaultFooterProps {
  onSend?: (content: string) => void;
  backgroundColor: string;
}

export function CommentList({ maxFields = 2 }: { maxFields: number }) {
  const { theme, isDark } = useTheme();
  const { product } = useProduct();
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (product) {
      getCommentsByProductId(product.id, maxFields)
        .then((comments) => setComments(comments))
        .catch(() => {});
    }
  }, [product, maxFields]);

  return comments.map((comment) => (
    <View
      key={comment.id}
      style={[
        styles.reviewCard,
        {
          backgroundColor: isDark ? theme.outline : theme.background,
          gap: 8,
        },
      ]}
    >
      <Layout
        direction="row"
        alignVertical="space-between"
        alignHorizontal="center"
      >
        <Label weight="semibold" size="sm">
          {comment.userName}
        </Label>
      </Layout>
      <Label size="md" weight="extralight">
        {comment.content}
      </Label>
    </View>
  ));
}

const CommentsSheetFooter = function CommentsFooter({
  backgroundColor,
  onSend,
  ...props
}: CommentSheetFooterProps) {
  const { theme } = useTheme();
  const [comment, setComment] = useState("");

  const handleSend = () => {
    if (comment === "") return;
    onSend?.(comment);
    setComment("");
  };

  return (
    <BottomSheetFooter {...props} style={{ backgroundColor }}>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: spacing.sm,
          alignItems: "center",
          paddingVertical: spacing.md,
        }}
      >
        <BottomSheetTextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Comentar..."
          placeholderTextColor={theme.secondaryText}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              borderColor: theme.outline,
              color: theme.text,
            },
          ]}
        />
        <GestureIconButton
          icon="Send"
          size={24}
          onPress={() => handleSend()}
          disabled={comment === ""}
        />
      </View>
    </BottomSheetFooter>
  );
};

export function CommentButton() {
  const { openComment } = useProduct();

  return (
    <IconButton
      icon="MessageCircleMore"
      variant="outline"
      onPress={() => openComment()}
    />
  );
}

export function ViewAllButton() {
  const { theme } = useTheme();
  const { openComment } = useProduct();

  return (
    <PressableLayout onPress={() => openComment()}>
      <Label color={theme.primary}>Ver todas</Label>
    </PressableLayout>
  );
}

const EmptyOrLoading = ({ loading }: { loading: boolean }) => {
  return loading ? (
    <LoadingTemplate />
  ) : (
    <EmptyTemplate
      icon="MessageCircleQuestionMark"
      message="No hay comentarios aún."
    />
  );
};

export function BottomSheetComment() {
  const { theme, isDark } = useTheme();
  const { product, commentSheetRef } = useProduct();
  const { user } = useAuth();

  const [comments, setComments] = useState<Comment[]>([]);
  const [isOpened, setIsOpened] = useState(false);
  const [loading, setLoading] = useState(true);

  const backgroundColor = useMemo(
    () => (isDark ? theme.surface : theme.background),
    [theme, isDark]
  );

  const handleSend = async (content: string) => {
    const comment = {
      userId: user?.uid,
      productId: product?.id,
      userName: user?.displayName,
      content,
      userPhoto: user?.photoURL,
    } as Comment;
    await addComment(comment);
  };

  const commentItem = useCallback(
    ({ item }: { item: Comment }) => (
      <Layout direction="row" gap={spacing.sm} alignHorizontal="flex-start">
        <Avatar
          size={40}
          source={item.userPhoto ? { uri: item.userPhoto } : undefined}
          name={item.userName}
          online={false}
        />

        <View style={styles.comment_content}>
          <Label weight="semibold" color="gray" size="sm">
            {item.userName}
          </Label>

          <Label style={styles.comment_text} numberOfLines={2}>
            {item.content}
          </Label>

          <Label weight="semibold" color="gray" size="sm">
            {timeAgo(item.createdAt)}
          </Label>
        </View>
      </Layout>
    ),
    []
  );

  const footerComponent = useCallback(
    (props: any) => {
      if (!user) return null;

      return (
        <CommentsSheetFooter
          backgroundColor={backgroundColor}
          onSend={(comment: string) => handleSend(comment)}
          {...props}
        />
      );
    },
    [user, backgroundColor]
  );

  useEffect(() => {
    if (!isOpened || !product?.id) return;

    const unsubscribe = subscribeToComentsByProductId(
      product.id,
      (comments) => {
        setComments(comments);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOpened, product?.id]);

  return (
    <BottomSheetModal
      ref={commentSheetRef}
      snapPoints={["55%", "90%"]}
      enableDynamicSizing={false}
      enablePanDownToClose
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      backgroundStyle={{ backgroundColor }}
      handleComponent={() => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: spacing.md,
            alignItems: "center",
          }}
        >
          <Label size="sm">Comentarios</Label>

          <IconButton icon="ArrowDownAz" size={iconography.xs} />
        </View>
      )}
      footerComponent={footerComponent}
      onChange={(index) => {
        if (index >= 0) setIsOpened(true);
      }}
    >
      <BottomSheetFlatList
        data={comments}
        keyExtractor={(item: Comment) => item.id}
        renderItem={commentItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list_container}
        ListEmptyComponent={() => <EmptyOrLoading loading={loading} />}
        keyboardShouldPersistTaps="handled"
      />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  reviewCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    alignSelf: "stretch",
  },
  list_container: {
    padding: spacing.md,
    gap: spacing.md,
  },
  comment_content: {
    flex: 1,
    flexShrink: 1,
    gap: spacing.sm,
  },

  comment_text: {
    flexWrap: "wrap",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: "rgba(151, 151, 151, 0.25)",
  },
});
