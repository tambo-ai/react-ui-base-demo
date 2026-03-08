"use client";

import {
  ThreadHistory,
  ThreadContent,
  MessageInput,
  Message,
  ReasoningInfo,
  ToolcallInfo,
} from "@tambo-ai/react-ui-base";
import { useTambo, useTamboThreadList } from "@tambo-ai/react";
import Link from "next/link";
import {
  Button,
  Input,
  Card,
  Spin,
  Alert,
  Typography,
  Menu,
  Space,
  Flex,
  Layout,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Progress,
  Divider,
  Badge,
} from "antd";
import {
  SendOutlined,
  PaperClipOutlined,
  StopOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DownOutlined,
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  MessageOutlined,
  CloseOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useScrollToBottom } from "@/components/chat-layout";
import { PropsWithChildren, useState, useEffect, useRef } from "react";

const { Header, Content } = Layout;

// --- Dashboard mock data ---

const recentActivity = [
  {
    key: "1",
    user: "Alice Chen",
    action: "Created new project",
    status: "success",
    time: "2 min ago",
  },
  {
    key: "2",
    user: "Bob Martinez",
    action: "Uploaded dataset",
    status: "processing",
    time: "15 min ago",
  },
  {
    key: "3",
    user: "Carol Wang",
    action: "Generated report",
    status: "success",
    time: "1 hr ago",
  },
  {
    key: "4",
    user: "Dave Johnson",
    action: "Failed deployment",
    status: "error",
    time: "2 hr ago",
  },
  {
    key: "5",
    user: "Eve Park",
    action: "Updated settings",
    status: "success",
    time: "3 hr ago",
  },
];

const activityColumns = [
  { title: "User", dataIndex: "user", key: "user" },
  { title: "Action", dataIndex: "action", key: "action" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      const colorMap: Record<string, string> = {
        success: "green",
        processing: "blue",
        error: "red",
      };
      return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
    },
  },
  { title: "Time", dataIndex: "time", key: "time" },
];

export default function AntdDemo() {
  const { currentThreadId, switchThread } = useTambo();
  const { data } = useTamboThreadList();

  const [chatOpen, setChatOpen] = useState(false);
  const [threadsOpen, setThreadsOpen] = useState(false);
  const threadsRef = useRef<HTMLDivElement>(null);
  const threadsButtonRef = useRef<HTMLButtonElement>(null);
  const { ref: chatScrollRef } = useScrollToBottom(500);

  // Auto-switch to the most recent thread on initial load
  useEffect(() => {
    if (currentThreadId === "placeholder" && data?.threads?.length) {
      switchThread(data.threads[0].id);
    }
  }, [currentThreadId, data?.threads, switchThread]);

  // Click-outside-to-close for threads overlay
  useEffect(() => {
    if (!threadsOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        threadsRef.current &&
        !threadsRef.current.contains(e.target as Node) &&
        threadsButtonRef.current &&
        !threadsButtonRef.current.contains(e.target as Node)
      ) {
        setThreadsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [threadsOpen]);

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* ===== HEADER ===== */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Left: logo + nav */}
        <Flex align="center" gap={24}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Typography.Title
              level={4}
              style={{ margin: 0, whiteSpace: "nowrap" }}
            >
              Admin Dashboard
            </Typography.Title>
          </Link>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={["dashboard"]}
            style={{ border: "none", flex: 1 }}
            items={[
              {
                key: "dashboard",
                icon: <DashboardOutlined />,
                label: "Dashboard",
              },
              {
                key: "analytics",
                icon: <BarChartOutlined />,
                label: "Analytics",
              },
              { key: "users", icon: <UserOutlined />, label: "Users" },
              {
                key: "settings",
                icon: <SettingOutlined />,
                label: "Settings",
              },
            ]}
          />
        </Flex>

        {/* Right: threads button */}
        <div style={{ position: "relative" }}>
          <Badge
            count={data?.threads?.length ?? 0}
            size="small"
            offset={[-4, 4]}
          >
            <Button
              ref={threadsButtonRef}
              icon={<MenuOutlined />}
              onClick={() => setThreadsOpen((v) => !v)}
            >
              Threads
            </Button>
          </Badge>

          {/* Threads overlay */}
          {threadsOpen && (
            <div
              ref={threadsRef}
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 280,
                background: "#fff",
                borderRadius: 8,
                boxShadow:
                  "0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)",
                padding: 16,
                zIndex: 1000,
              }}
            >
              <ThreadHistory.Root>
                <Flex
                  justify="space-between"
                  align="center"
                  style={{ marginBottom: 8 }}
                >
                  <Typography.Title level={5} style={{ margin: 0 }}>
                    Threads
                  </Typography.Title>
                  <Button
                    type="text"
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={() => setThreadsOpen(false)}
                  />
                </Flex>
                <ThreadHistory.NewThreadButton
                  render={<Button size="small" block />}
                >
                  + New thread
                </ThreadHistory.NewThreadButton>
                <ThreadHistory.List
                  render={(_props, state) => (
                    <Menu
                      mode="inline"
                      selectedKeys={state.filteredThreads
                        .filter((t) => t.id === currentThreadId)
                        .map((t) => t.id)}
                      style={{ border: "none", marginTop: 8 }}
                      items={state.filteredThreads.map((thread) => ({
                        key: thread.id,
                        label: (
                          <ThreadHistory.Item
                            thread={thread}
                            render={(props) => <span {...props} />}
                          />
                        ),
                      }))}
                    />
                  )}
                />
              </ThreadHistory.Root>
            </div>
          )}
        </div>
      </Header>

      {/* ===== DASHBOARD CONTENT ===== */}
      <Content
        style={{
          padding: 24,
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Breadcrumb */}
        <Space style={{ marginBottom: 16 }}>
          <Link href="/">
            <Typography.Link>&larr; Home</Typography.Link>
          </Link>
          <span>/</span>
          <Typography.Text>Ant Design</Typography.Text>
        </Space>

        {/* Stat cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={28453}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#1677ff" }}
              />
              <Progress percent={72} size="small" showInfo={false} />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                +12% from last month
              </Typography.Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Revenue"
                value={93842}
                prefix="$"
                precision={2}
                valueStyle={{ color: "#52c41a" }}
              />
              <Progress
                percent={85}
                size="small"
                showInfo={false}
                strokeColor="#52c41a"
              />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                +8.2% from last month
              </Typography.Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Sessions"
                value={1293}
                prefix={<BarChartOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
              <Progress
                percent={58}
                size="small"
                showInfo={false}
                strokeColor="#722ed1"
              />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                -3% from last hour
              </Typography.Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Avg Response Time"
                value={142}
                suffix="ms"
                valueStyle={{ color: "#faad14" }}
              />
              <Progress
                percent={42}
                size="small"
                showInfo={false}
                strokeColor="#faad14"
              />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                -18ms from yesterday
              </Typography.Text>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Alerts */}
        <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
          <Alert
            message="System update scheduled"
            description="A maintenance window is planned for March 12, 2026 from 02:00 to 04:00 UTC."
            type="info"
            showIcon
            closable
          />
          <Alert
            message="Deployment successful"
            description="v2.4.1 has been deployed to production."
            type="success"
            showIcon
            closable
          />
        </Space>

        {/* Recent activity table */}
        <Card title="Recent Activity" style={{ marginBottom: 24 }}>
          <Table
            dataSource={recentActivity}
            columns={activityColumns}
            pagination={false}
            size="middle"
          />
        </Card>

        {/* Progress section */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="Server Load">
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Typography.Text>CPU Usage</Typography.Text>
                  <Progress percent={64} status="active" />
                </div>
                <div>
                  <Typography.Text>Memory</Typography.Text>
                  <Progress
                    percent={48}
                    status="active"
                    strokeColor="#52c41a"
                  />
                </div>
                <div>
                  <Typography.Text>Disk I/O</Typography.Text>
                  <Progress
                    percent={82}
                    status="active"
                    strokeColor="#faad14"
                  />
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Deployment Pipeline">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Flex justify="space-between">
                  <Typography.Text>Build</Typography.Text>
                  <Tag color="green">Passed</Tag>
                </Flex>
                <Progress
                  percent={100}
                  size="small"
                  strokeColor="#52c41a"
                />
                <Flex justify="space-between">
                  <Typography.Text>Tests</Typography.Text>
                  <Tag color="green">142 / 142</Tag>
                </Flex>
                <Progress
                  percent={100}
                  size="small"
                  strokeColor="#52c41a"
                />
                <Flex justify="space-between">
                  <Typography.Text>Deploy to Staging</Typography.Text>
                  <Tag color="blue">In Progress</Tag>
                </Flex>
                <Progress percent={67} size="small" status="active" />
                <Flex justify="space-between">
                  <Typography.Text>Deploy to Production</Typography.Text>
                  <Tag color="default">Pending</Tag>
                </Flex>
                <Progress percent={0} size="small" />
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>

      {/* ===== FLOATING CHAT BUBBLE ===== */}
      {!chatOpen && (
        <Button
          data-testid="chat-bubble"
          type="primary"
          shape="circle"
          size="large"
          icon={<MessageOutlined />}
          onClick={() => setChatOpen(true)}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            fontSize: 24,
            zIndex: 999,
            boxShadow:
              "0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)",
          }}
        />
      )}

      {/* ===== FLOATING CHAT WINDOW ===== */}
      {chatOpen && (
        <Card
          title={
            <Flex align="center" gap={8}>
              <MessageOutlined />
              <span>Chat</span>
            </Flex>
          }
          extra={
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={() => setChatOpen(false)}
            />
          }
          styles={{
            body: {
              padding: 0,
              display: "flex",
              flexDirection: "column",
              height: "calc(100% - 57px)",
            },
          }}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 400,
            height: 520,
            zIndex: 999,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow:
              "0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Message area */}
          <div
            ref={chatScrollRef}
            style={{
              flex: "1 1 auto",
              overflowY: "auto",
              padding: 16,
            }}
          >
            <ThreadContent.Root
              style={{ display: "flex", flexDirection: "column" }}
            >
              <ThreadContent.Messages
                render={(_props, state) => (
                  <>
                    {state.filteredMessages.map((msg) => (
                      <Message.Root
                        key={msg.id}
                        message={msg}
                        role={msg.role as "user" | "assistant"}
                        render={<MessageContent role={msg.role} />}
                      >
                        <ReasoningInfo.Root>
                          <ReasoningInfo.Trigger
                            render={(props) => (
                              <Card
                                size="small"
                                style={{ marginBottom: 4 }}
                                {...props}
                              >
                                <Flex align="center" gap={8}>
                                  <ReasoningInfo.StatusText
                                    render={(_props, state) =>
                                      state.isLoading ? (
                                        <Spin size="small" />
                                      ) : (
                                        <BulbOutlined />
                                      )
                                    }
                                  />
                                  <ReasoningInfo.StatusText />
                                </Flex>
                              </Card>
                            )}
                          />
                          <ReasoningInfo.Content>
                            <ReasoningInfo.Steps />
                          </ReasoningInfo.Content>
                        </ReasoningInfo.Root>
                        <ToolcallInfo.Root>
                          <Card size="small" style={{ marginBottom: 4 }}>
                            <Flex align="center" gap={8}>
                              <ToolcallInfo.StatusIcon
                                render={(_props, state) => {
                                  switch (state.status) {
                                    case "loading":
                                      return <Spin size="small" />;
                                    case "success":
                                      return (
                                        <CheckCircleOutlined
                                          style={{ color: "#52c41a" }}
                                        />
                                      );
                                    case "error":
                                      return (
                                        <ExclamationCircleOutlined
                                          style={{ color: "#ff4d4f" }}
                                        />
                                      );
                                  }
                                }}
                              />
                              <ToolcallInfo.Trigger
                                render={(props, { state }) => (
                                  <Flex align="center" gap={8} {...props}>
                                    <ToolcallInfo.ToolName />
                                    <CollapsibleTrigger
                                      state={state as "open" | "closed"}
                                    />
                                  </Flex>
                                )}
                              />
                            </Flex>
                            <ToolcallInfo.Content>
                              <Space
                                direction="vertical"
                                style={{ width: "100%", marginTop: 8 }}
                              >
                                <ToolcallInfo.Parameters
                                  render={<CodeBlock title="Parameters" />}
                                />
                                <ToolcallInfo.Result
                                  render={<CodeBlock title="Result" />}
                                />
                              </Space>
                            </ToolcallInfo.Content>
                          </Card>
                        </ToolcallInfo.Root>

                        <Message.RenderedComponent>
                          <Message.RenderedComponentContent />
                        </Message.RenderedComponent>

                        <Message.Content
                          render={(props, { contentAsMarkdownString }) => (
                            <MessageBubble role={msg.role} {...props}>
                              {contentAsMarkdownString}
                            </MessageBubble>
                          )}
                        />

                        <Message.LoadingIndicator
                          render={<Spin size="small" />}
                        />
                      </Message.Root>
                    ))}
                  </>
                )}
              />
            </ThreadContent.Root>
          </div>

          {/* Input area */}
          <div
            style={{
              borderTop: "1px solid #f0f0f0",
              padding: 12,
            }}
          >
            <MessageInput.Root>
              <MessageInput.StagedImages />
              <MessageInput.Content render={<Flex gap={8} align="start" />}>
                <Flex vertical style={{ flex: "1 1 auto" }}>
                  <MessageInput.Error
                    render={(props) => (
                      <Alert
                        type="error"
                        showIcon
                        style={{ marginBottom: 8 }}
                        message={props.children}
                      />
                    )}
                  />
                  <MessageInput.Textarea
                    placeholder="Type a message..."
                    render={
                      <Input.TextArea
                        autoSize={{ minRows: 1, maxRows: 4 }}
                      />
                    }
                  />
                </Flex>
                <Space>
                  <MessageInput.FileButton
                    render={
                      <Button
                        icon={<PaperClipOutlined />}
                        aria-label="Attach File"
                      />
                    }
                  />
                  <MessageInput.SubmitButton
                    render={
                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        aria-label="Send"
                      />
                    }
                  />
                  <MessageInput.StopButton
                    render={
                      <Button
                        danger
                        icon={<StopOutlined />}
                        aria-label="Stop"
                      />
                    }
                  />
                </Space>
              </MessageInput.Content>
            </MessageInput.Root>
          </div>
        </Card>
      )}
    </Layout>
  );
}

function MessageContent({
  role,
  children,
  ...props
}: PropsWithChildren<{ role: string }>) {
  return (
    <div
      style={{
        marginBottom: 12,
        display: "flex",
        flex: "1 1 auto",
        alignSelf: role === "user" ? "flex-end" : "flex-start",
        maxWidth: "70%",
        flexDirection: "column",
        gap: 8,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function CollapsibleTrigger({
  state,
  children,
  ...props
}: PropsWithChildren<{ state: "open" | "closed" }>) {
  return (
    <span {...props} style={{ cursor: "pointer" }}>
      {children}
      <DownOutlined
        style={{
          fontSize: 10,
          marginLeft: 4,
          transform: state === "open" ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }}
      />
    </span>
  );
}

function MessageBubble({
  role,
  children,
  ...props
}: PropsWithChildren<{ role: string }>) {
  if (typeof children === "string" && children.trim() === "") return null;
  if (!children) return null;

  return (
    <div
      style={{
        padding: "8px 12px",
        borderRadius: 6,
        backgroundColor: role === "user" ? "#1677ff" : "#f5f5f5",
        color: role === "user" ? "#ffffff" : "rgba(0, 0, 0, 0.88)",
        fontSize: 14,
        lineHeight: 1.5,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function CodeBlock({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <div
      style={{
        borderRadius: 6,
        border: "1px solid #f0f0f0",
        overflow: "hidden",
        fontSize: 10,
      }}
    >
      {title && (
        <div
          style={{
            padding: "2px 8px",
            backgroundColor: "#fafafa",
            borderBottom: "1px solid #f0f0f0",
            fontWeight: 600,
            color: "rgba(0, 0, 0, 0.45)",
          }}
        >
          {title}
        </div>
      )}
      <pre
        style={{
          margin: 0,
          padding: "8px 12px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace",
          color: "rgba(0, 0, 0, 0.88)",
          lineHeight: 1.5,
        }}
      >
        {children}
      </pre>
    </div>
  );
}
